"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSession,
  verifyPassword,
} from "@/lib/auth";

function safeNext(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "/admin/new";
  if (!value.startsWith("/") || value.startsWith("//")) return "/admin/new";
  return value;
}

export async function login(formData: FormData) {
  const password = formData.get("password");
  const rawNext = formData.get("next");
  const next = safeNext(rawNext);

  if (typeof password !== "string" || !(await verifyPassword(password))) {
    const params = new URLSearchParams({ error: "1" });
    if (typeof rawNext === "string" && rawNext.startsWith("/")) {
      params.set("next", rawNext);
    }
    redirect(`/admin/login?${params.toString()}`);
  }

  const token = await signSession();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect(next);
}
