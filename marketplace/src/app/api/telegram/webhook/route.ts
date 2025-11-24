import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const update = await request.json();
    console.log("[telegram:webhook]", update?.message?.text ?? "ping");
  } catch (error) {
    console.error("[telegram:webhook] failed to parse update", error);
  }

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: true });
}
