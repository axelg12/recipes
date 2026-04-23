const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function base64urlEncode(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(s: string): Uint8Array<ArrayBuffer> {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const binary = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function getHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(requireEnv("SESSION_SECRET")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function verifyPassword(input: string): Promise<boolean> {
  const expected = requireEnv("ADMIN_PASSWORD");
  const a = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  const b = await crypto.subtle.digest("SHA-256", encoder.encode(expected));
  return timingSafeEqual(new Uint8Array(a), new Uint8Array(b));
}

export async function signSession(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = base64urlEncode(encoder.encode(JSON.stringify({ exp })));
  const key = await getHmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${base64urlEncode(new Uint8Array(sig))}`;
}

export async function verifySession(
  value: string | undefined | null,
): Promise<boolean> {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  try {
    const key = await getHmacKey();
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      base64urlDecode(sig),
      encoder.encode(payload),
    );
    if (!ok) return false;
    const data = JSON.parse(decoder.decode(base64urlDecode(payload))) as {
      exp?: number;
    };
    if (typeof data.exp !== "number") return false;
    return data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
