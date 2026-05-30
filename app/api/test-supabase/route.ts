import { NextResponse } from "next/server";
import dns from "dns/promises";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const host = url.replace("https://", "").replace("/", "");

  const result: Record<string, unknown> = {
    url: url || "MISSING",
    key_set: !!key,
    host,
  };

  // 1. DNS check
  try {
    const addr = await dns.lookup(host);
    result.dns = "ok";
    result.dns_ip = addr.address;
  } catch (e) {
    result.dns = "FAILED";
    result.dns_error = e instanceof Error ? e.message : String(e);
  }

  // 2. Auth health endpoint (no key needed)
  try {
    const r = await fetch(`${url}/auth/v1/health`, {
      signal: AbortSignal.timeout(8000),
    });
    result.auth_health_status = r.status;
    result.auth_health_body = await r.text();
  } catch (e) {
    result.auth_health = "FAILED";
    result.auth_health_error = e instanceof Error ? e.message : String(e);
  }

  // 3. REST endpoint with key
  try {
    const r = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    result.rest_status = r.status;
  } catch (e) {
    result.rest = "FAILED";
    result.rest_error = e instanceof Error ? e.message : String(e);
  }

  // 4. Supabase JS SDK auth test
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key);
    const { error } = await supabase.auth.getUser();
    result.sdk_auth = error ? `error: ${error.message}` : "ok";
  } catch (e) {
    result.sdk_auth = "FAILED";
    result.sdk_error = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(result, { status: 200 });
}
