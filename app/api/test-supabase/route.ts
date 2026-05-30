import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const result: Record<string, unknown> = {
    url_set: !!url,
    url_value: url ? url.substring(0, 40) + "..." : "MISSING",
    key_set: !!key,
    key_prefix: key ? key.substring(0, 20) + "..." : "MISSING",
    timestamp: new Date().toISOString(),
  };

  // Try a raw fetch to the Supabase health endpoint
  if (url) {
    try {
      const res = await fetch(`${url}/rest/v1/`, {
        headers: { apikey: key ?? "", Authorization: `Bearer ${key ?? ""}` },
        signal: AbortSignal.timeout(5000),
      });
      result.supabase_reachable = true;
      result.supabase_status = res.status;
    } catch (err: unknown) {
      result.supabase_reachable = false;
      result.supabase_error = err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json(result, { status: 200 });
}
