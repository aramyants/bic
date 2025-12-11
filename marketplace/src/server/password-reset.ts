import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { adminSessions, passwordResetTokens, users } from "@/db/schema";
import { generateOtpCode, generateSessionToken, hashOtpCode, hashPassword, hashSessionToken } from "@/lib/security";
import { sendUserEmail } from "@/server/email";

const RESET_TTL_MINUTES = 20;
const APP_URL =
  (process.env.PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export async function requestPasswordReset(email: string) {
  const normalizedEmail = email.toLowerCase();
  const user = await db.query.users.findFirst({
    where: eq(users.email, normalizedEmail),
  });

  if (!user) {
    // Do not disclose whether the user exists.
    return;
  }

  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));

  const token = generateSessionToken();
  const otp = generateOtpCode();
  const tokenHash = hashSessionToken(token);
  const otpHash = hashOtpCode(otp);
  const expiresAt = new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000);

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    tokenHash,
    otpHash,
    expiresAt,
  });

  const resetLink = `${APP_URL}/admin/reset?token=${encodeURIComponent(token)}`;
  const subject = "B.I.C. — восстановление пароля";
  const html = `
    <p>Здравствуйте${user.name ? `, ${user.name}` : ""}!</p>
    <p>Вы запросили восстановление пароля для панели администратора B.I.C.</p>
    <p><strong>Код подтверждения: ${otp}</strong></p>
    <p>Ссылка для сброса пароля: <a href="${resetLink}">${resetLink}</a></p>
    <p>Срок действия кода и ссылки: ${RESET_TTL_MINUTES} минут.</p>
    <p>Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>
  `;

  try {
    await sendUserEmail(user.email, subject, html);
  } catch (error) {
    console.error("[password-reset] failed to send email", error);
  }
}

export async function resetPasswordWithOtp(params: {
  token: string;
  otp: string;
  newPassword: string;
}) {
  const { token, otp, newPassword } = params;
  const tokenHash = hashSessionToken(token);

  const record = await db.query.passwordResetTokens.findFirst({
    where: eq(passwordResetTokens.tokenHash, tokenHash),
    with: { user: true },
  });

  if (!record?.user) {
    return false;
  }

  if (record.usedAt || record.expiresAt.getTime() < Date.now()) {
    return false;
  }

  const providedOtpHash = hashOtpCode(otp);
  if (providedOtpHash !== record.otpHash) {
    return false;
  }

  const passwordHash = await hashPassword(newPassword);

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, record.userId));

    await tx
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, record.id));

    await tx.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, record.userId));
    await tx.delete(adminSessions).where(eq(adminSessions.userId, record.userId));
  });

  return true;
}
