import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LIVE_CALL_SYSTEM = `You are Mina, assisting someone during a live debt collector call. The user types what the collector says and you respond with real-time guidance.

Always respond in this exact format:
TACTIC: [one sentence describing the pressure tactic being used, or "None detected"]
SAY THIS: "[exact words the user should say — keep it short, non-committal, and firm]"
NOTE: [one short sentence of protective context]

Rules:
- Never suggest agreeing to payment without written verification first
- The phrase "Please send that in writing" is always safe
- Silence and asking for time is always legal
- Flag any threats or urgency as manufactured pressure
- Be a protective presence, not a panicky one`;

export async function POST(req: NextRequest) {
  try {
    const { callerStatement, callHistory } = await req.json();

    const messages = [
      ...(callHistory || []),
      { role: "user" as const, content: `Collector said: "${callerStatement}"` },
    ];

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: LIVE_CALL_SYSTEM,
      messages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response" }, { status: 500 });
    }

    // Parse response line by line (avoids s-flag ES2018 requirement)
    const text = content.text;
    const lines = text.split("\n").map((l: string) => l.trim()).filter(Boolean);
    const tacticLine = lines.find((l: string) => l.startsWith("TACTIC:")) ?? "";
    const sayLine = lines.find((l: string) => l.startsWith("SAY THIS:")) ?? "";
    const noteLine = lines.find((l: string) => l.startsWith("NOTE:")) ?? "";
    const tacticMatch = tacticLine ? [null, tacticLine.replace(/^TACTIC:\s*/, "")] : null;
    const sayMatch = sayLine ? [null, sayLine.replace(/^SAY THIS:\s*/, "").replace(/^"/, "").replace(/"$/, "")] : null;
    const noteMatch = noteLine ? [null, noteLine.replace(/^NOTE:\s*/, "")] : null;

    return NextResponse.json({
      tactic: tacticMatch?.[1]?.trim() ?? "Analyzing...",
      sayThis: sayMatch?.[1]?.trim() ?? "Please send that information in writing.",
      note: noteMatch?.[1]?.trim() ?? "",
      raw: text,
    });
  } catch (err) {
    console.error("Live call API error:", err);
    return NextResponse.json(
      {
        tactic: "Unable to analyze",
        sayThis: "Please send that information in writing before I make any decision.",
        note: "Mina is temporarily unavailable. Use the default response above.",
      },
      { status: 200 } // Return 200 with fallback so the call session continues
    );
  }
}
