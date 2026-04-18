import type { Kv } from "@deno/kv";

type MaybeDenoGlobal = {
  Deno?: {
    openKv?: () => Promise<Kv>;
  };
};

let kvPromise: Promise<Kv> | null = null;

export function getKv(): Promise<Kv> {
  if (!kvPromise) {
    kvPromise = openKvOnce();
  }
  return kvPromise;
}

async function openKvOnce(): Promise<Kv> {
  const deno = (globalThis as MaybeDenoGlobal).Deno;
  if (deno?.openKv) {
    return deno.openKv();
  }
  const { openKv } = await import("@deno/kv");
  return openKv(process.env.DENO_KV_URL ?? "./data/local-kv.sqlite");
}
