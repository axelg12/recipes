import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";

async function clearAndRedirect(origin: string): Promise<Response> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return Response.redirect(new URL("/", origin), 303);
}

export async function POST(request: Request) {
  return clearAndRedirect(new URL(request.url).origin);
}

export async function GET(request: Request) {
  return clearAndRedirect(new URL(request.url).origin);
}
