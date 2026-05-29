import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MINA_SYSTEM = `You are Mina, a financial pressure recovery coach. You are calm, direct, intelligent, and non-judgmental. You help people facing debt collectors, missed payments, medical debt, IRS notices, and financial pressure stay calm, understand what is happening, and know what to do next.

Rules:
- Never recommend paying immediately without understanding the situation first
- Always recommend requesting written verification before agreeing to anything
- Never provide legal advice — always clarify you are an educational guide
- Keep responses clear, brief, and actionable (3–5 sentences max unless asked for more)
- If someone seems to be in crisis or mentions urgent legal deadlines, prioritize that above everything else
- Never use fear language. Be the calmest voice in the room.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionContext } = await req.json();

    const system = sessionContext
      ? `${MINA_SYSTEM}\n\nUser context: ${sessionContext}`
      : MINA_SYSTEM;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system,
      messages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type" }, { status: 500 });
    }

    return NextResponse.json({ content: content.text });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Mina is temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
