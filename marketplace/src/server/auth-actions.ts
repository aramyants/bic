"use server";

import { redirect } from "next/navigation";

import { signIn, signOut } from "@/server/auth";
import { requestPasswordReset, resetPasswordWithOtp } from "@/server/password-reset";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await signIn(email, password);
  if (!user) {
    redirect("/admin/login?error=1");
  }

  redirect("/admin");
}

export async function signOutAction() {
  await signOut();
  redirect("/admin/login");
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").toLowerCase();
  await requestPasswordReset(email);
  redirect("/admin/forgot?sent=1");
}

export async function resetPasswordAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const otp = String(formData.get("otp") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const hasInvalidInput =
    !token || !otp || !password || password !== confirm || password.length < 8;

  if (hasInvalidInput) {
    redirect(`/admin/reset?token=${encodeURIComponent(token)}&error=1`);
  }

  const ok = await resetPasswordWithOtp({ token, otp, newPassword: password });
  if (!ok) {
    redirect(`/admin/reset?token=${encodeURIComponent(token)}&error=1`);
  }

  redirect("/admin/login?reset=1");
}
