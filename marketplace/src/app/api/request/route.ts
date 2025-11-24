import { NextResponse } from "next/server";

import { contactFormSchema, normalizePhone, normalizeTelegram } from "@/lib/forms";
import { sendInquiryEmail } from "@/server/email";
import { recordInquiry } from "@/server/vehicle-service";

export async function POST(request: Request) {
  const formData = await request.formData();
  const raw = Object.fromEntries(formData.entries());

  const parseResult = contactFormSchema.safeParse(raw);
  if (!parseResult.success) {
    return NextResponse.redirect(new URL("/?error=form", request.url), { status: 303 });
  }

  const data = parseResult.data;
  const phoneCountry = (data.phoneCountry as Parameters<typeof normalizePhone>[1]) || "RU";
  const phoneNumber = normalizePhone(data.phoneE164 || data.phone, phoneCountry);
  if (!phoneNumber) {
    return NextResponse.redirect(new URL("/?error=form", request.url), { status: 303 });
  }

  const formattedPhone = phoneNumber.international;
  const phoneE164 = phoneNumber.e164;
  const telegram = normalizeTelegram(data.telegram, phoneCountry);

  const payload = {
    ...raw,
    phone: formattedPhone,
    phoneE164,
    phoneCountry: phoneCountry,
    telegram,
    message: data.message,
  };

  await recordInquiry({
    customerType: data.customerType,
    name: data.name,
    email: data.email,
    phone: formattedPhone,
    message: data.message,
    payload: JSON.stringify(payload),
  });

  await sendInquiryEmail(
    `Новая заявка B.I.C. от ${data.name}`,
    `
      <h1>Новая заявка</h1>
      <p><strong>Имя:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Телефон:</strong> ${formattedPhone} (${country})</p>
      ${telegram ? `<p><strong>Telegram:</strong> ${telegram}</p>` : ""}
      ${data.message ? `<p><strong>Комментарий:</strong> ${data.message}</p>` : ""}
    `,
  );

  return NextResponse.redirect(new URL("/?submitted=1", request.url), { status: 303 });
}
