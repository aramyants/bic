"use server";

import { redirect } from "next/navigation";

import { signIn, signOut } from "@/server/auth";

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
