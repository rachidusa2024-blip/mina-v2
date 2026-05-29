"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ScrollText, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Letter { id: string; title: string; letter_type: string; status: string; content: string; created_at: string; }

const LETTER_TYPES = [
  { type: "Debt Validation Request", desc: "Ask the collector to prove the debt is valid before you pay anything." },
  { type: "Cease and Desist", desc: "Tell the collector to stop contacting you. Know your rights before using this." },
  { type: "Dispute Letter", desc: "Challenge incorrect information on your credit report or in a debt claim." },
  { type: "Settlement Counter-Offer", desc: "Respond to a settlement offer with a lower counter-offer in writing." },
];

async function generateLetter(type: string, userId: string): Promise<Letter | null> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: `Write a professional ${type} letter for debt collection situations. Use [YOUR NAME], [DATE], [COLLECTOR NAME], [ACCOUNT NUMBER] as placeholders. Keep it firm, clear, and legally sound. Do not provide legal advice — note at the end that the user should consult an attorney if needed.` }],
      }),
    });
    const data = await res.json();
    const content = data.content ?? `[${type} template could not be generated. Please try again.]`;

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: saved } = await supabase.from("letter_records").insert({
      user_id: userId, letter_type: type, title: type, content, status: "draft",
    }).select().single();
    return saved ?? null;
  } catch { return null; }
}

async function loadLetters(): Promise<Letter[]> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase.from("letter_records").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    return data ?? [];
  } catch { return []; }
}

export default function LettersPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [view, setView] = useState<"list" | "types" | "detail">("list");
  const [selected, setSelected] = useState<Letter | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserId(user.id);
      } catch {}
    })();
    loadLetters().then(setLetters);
  }, []);

  const handleGenerate = async (type: string) => {
    if (!userId) return;
    setGenerating(type);
    const letter = await generateLetter(type, userId);
    if (letter) { setLetters(prev => [letter, ...prev]); setSelected(letter); setView("detail"); }
    setGenerating(null);
  };

  if (view === "detail" && selected) return (
    <div style={{ background: "#090D1A", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 16px" }}>
        <button onClick={() => setView("list")} style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#8892A4", fontSize: "14px", background: "none", border: "none", cursor: "pointer", marginBottom: "24px" }}>
          <ArrowLeft size={16} /> Back to letters
        </button>
        <div style={{ padding: "24px", borderRadius: "16px", background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ color: "#C9A84C", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "12px" }}>{selected.letter_type} — Draft</p>
          <pre style={{ color: "#F0F4FF", fontSize: "14px", lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'DM Sans', sans-serif" }}>{selected.content}</pre>
        </div>
      </div>
    </div>
  );

  if (view === "types") return (
    <div style={{ background: "#090D1A", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "24px 16px" }}>
        <button onClick={() => setView("list")} style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#8892A4", fontSize: "14px", background: "none", border: "none", cursor: "pointer", marginBottom: "32px" }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h2 style={{ color: "#F0F4FF", fontSize: "1.5rem", fontFamily: "'Cormorant Garamond', serif", marginBottom: "24px" }}>Choose a letter type</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {LETTER_TYPES.map(lt => (
            <button key={lt.type} onClick={() => handleGenerate(lt.type)} disabled={!!generating}
              style={{ padding: "16px 20px", borderRadius: "14px", background: "#111827", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left", cursor: generating ? "not-allowed" : "pointer", opacity: generating && generating !== lt.type ? 0.5 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ color: "#F0F4FF", fontSize: "15px", fontWeight: 600 }}>{lt.type}</p>
                {generating === lt.type && <Loader2 size={15} style={{ color: "#C9A84C", animation: "spin 1s linear infinite" }} />}
              </div>
              <p style={{ color: "#8892A4", fontSize: "13px", marginTop: "4px", lineHeight: 1.5 }}>{lt.desc}</p>
            </button>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ background: "#090D1A", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "24px 16px" }}>
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#8892A4", fontSize: "14px", textDecoration: "none", marginBottom: "32px" }}>
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <p style={{ color: "#C9A84C", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "8px" }}>Response Letters</p>
            <h1 style={{ color: "#F0F4FF", fontSize: "clamp(1.5rem, 5vw, 2rem)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>Your Responses</h1>
          </div>
          <button onClick={() => setView("types")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "10px", background: "#C9A84C", border: "none", color: "#090D1A", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            <Plus size={14} /> New Letter
          </button>
        </div>
        {letters.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <ScrollText size={24} style={{ color: "#C9A84C" }} />
            </div>
            <p style={{ color: "#F0F4FF", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>No letters yet</p>
            <p style={{ color: "#8892A4", fontSize: "14px", lineHeight: 1.6 }}>Generate a response letter — debt validation request, dispute, or settlement counter-offer.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {letters.map(l => (
              <button key={l.id} onClick={() => { setSelected(l); setView("detail"); }}
                style={{ padding: "16px 20px", borderRadius: "14px", background: "#111827", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left", cursor: "pointer" }}>
                <p style={{ color: "#F0F4FF", fontSize: "15px", fontWeight: 600 }}>{l.title}</p>
                <p style={{ color: "#8892A4", fontSize: "12px", marginTop: "4px" }}>{l.status} · {new Date(l.created_at).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
