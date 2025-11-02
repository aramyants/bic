import { NextResponse } from "next/server";
import { z } from "zod";

import { recordInquiry } from "@/server/vehicle-service";
import { sendInquiryEmail } from "@/server/email";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  customerType: z.enum(["INDIVIDUAL", "COMPANY"]).default("INDIVIDUAL"),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const raw = Object.fromEntries(formData.entries());

  const parseResult = schema.safeParse(raw);
  if (!parseResult.success) {
    return NextResponse.redirect(new URL("/?error=form", request.url), { status: 303 });
  }

  const data = parseResult.data;

  await recordInquiry({
    customerType: data.customerType,
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    payload: JSON.stringify(raw),
  });

  await sendInquiryEmail(
    `Новая заявка B.I.C. от ${data.name}`,
    `
      <h1>Новая заявка</h1>
      <p><strong>Имя:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Телефон:</strong> ${data.phone}</p>` : ""}
      ${data.message ? `<p><strong>Комментарий:</strong> ${data.message}</p>` : ""}
    `,
  );

  return NextResponse.redirect(new URL("/?submitted=1", request.url), { status: 303 });
}
