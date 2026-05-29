"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, HelpCircle, Phone, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const CSS = { "--bg-base": "#090D1A", "--bg-card": "#111827", "--text-prime": "#F0F4FF", "--text-muted": "#8892A4", "--teal": "#00C9A7", "--border": "rgba(255,255,255,0.08)" } as React.CSSProperties;

const OPTIONS = [
  { id: "overwhelmed", icon: Heart, label: "I feel overwhelmed", color: "#818CF8" },
  { id: "dont_know", icon: HelpCircle, label: "I don't know what to do", color: "#00C9A7" },
  { id: "afraid_call", icon: Phone, label: "I'm afraid to answer calls", color: "#f59e0b" },
  { id: "made_mistake", icon: AlertTriangle, label: "I think I made a mistake", color: "#ef4444" },
];

const MINA_RESPONSES: Record<string, string> = {
  overwhelmed: "That feeling makes sense. When everything arrives at once, the brain tries to process too much and shuts down. You do not have to solve everything right now. The next step is not to fix it all — it is to choose one thing and focus only on that.",
  dont_know: "Not knowing what to do is not a failure. It means the situation is genuinely unclear, and that is important information. Mina's job is to help you separate what actually needs to happen from what only feels urgent.",
  afraid_call: "Avoiding calls is one of the most common responses to collector pressure. You are not alone in this. Mina can help you prepare exactly what to say — so that when the phone rings, you already know how to handle it.",
  made_mistake: "Most mistakes in debt situations happen because someone responded under pressure before they understood their options. Whatever happened, there are almost always ways to address it. Let's look at what actually occurred before deciding what it means.",
};

async function saveToSupabase(mood: string, response: string) {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("stabilize_sessions").insert({
      user_id: user.id,
      flow_type: "mood_selection",
      emotional_state: mood,
      mina_response: response,
    });
  } catch {}
}

export default function StabilizePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSelect = async (id: string) => {
    setSelected(id);
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const res = MINA_RESPONSES[id];
    setResponse(res);
    setLoading(false);
    await saveToSupabase(id, res);
  };

  return (
    <div style={{ background: "#090D1A", minHeight: "100vh", "--bg-card": "#111827", "--text-prime": "#F0F4FF", "--text-muted": "#8892A4", "--teal": "#00C9A7", "--border": "rgba(255,255,255,0.08)", fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px" }}>

        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#8892A4", fontSize: "14px", textDecoration: "none", marginBottom: "32px" }}>
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div style={{ marginBottom: "32px" }}>
          <p style={{ color: "#00C9A7", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "8px" }}>Stabilize Mode</p>
          <h1 style={{ color: "#F0F4FF", fontSize: "clamp(1.6rem, 5vw, 2rem)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2, marginBottom: "8px" }}>
            What is happening right now?
          </h1>
          <p style={{ color: "#8892A4", fontSize: "14px", lineHeight: 1.6 }}>
            Choose what feels most true. Mina will focus on that first.
          </p>
        </div>

        {!response && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {OPTIONS.map(opt => {
              const Icon = opt.icon;
              return (
                <motion.button key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    padding: "16px 20px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)",
                    background: selected === opt.id ? `${opt.color}12` : "#111827",
                    cursor: loading ? "not-allowed" : "pointer", opacity: loading && selected !== opt.id ? 0.5 : 1,
                    textAlign: "left",
                  }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: `${opt.color}18`, flexShrink: 0 }}>
                    {loading && selected === opt.id
                      ? <Loader2 size={18} style={{ color: opt.color, animation: "spin 1s linear infinite" }} />
                      : <Icon size={18} style={{ color: opt.color }} />}
                  </div>
                  <span style={{ color: "#F0F4FF", fontSize: "15px", fontWeight: 500 }}>{opt.label}</span>
                </motion.button>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {response && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ padding: "20px 24px", borderRadius: "16px", background: "rgba(0,201,167,0.06)", border: "1px solid rgba(0,201,167,0.18)", marginBottom: "24px" }}>
                <p style={{ color: "#00C9A7", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "12px" }}>Mina</p>
                <p style={{ color: "#F0F4FF", fontSize: "15px", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.7, fontStyle: "italic" }}>
                  "{response}"
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <Link href="/chat" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px", borderRadius: "12px", background: "#00C9A7", color: "#090D1A", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
                  Talk to Mina
                </Link>
                <Link href="/dashboard" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8892A4", fontSize: "14px", textDecoration: "none" }}>
                  Back to dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
