"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ShieldCheck, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Decision { id: string; decision_text: string; risk_level: string; mina_guidance: string; created_at: string; }

async function loadDecisions(): Promise<Decision[]> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase.from("decision_records").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10);
    return data ?? [];
  } catch { return []; }
}

async function analyzeDecision(text: string, userId: string): Promise<Decision | null> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: `Analyze this financial decision or offer and give me: 1) Risk level (Low/Medium/High), 2) What they are really asking for, 3) What I should do before deciding.\n\nDecision/Offer: "${text}"` }],
        sessionContext: "User is asking for analysis of a financial decision or settlement offer before agreeing to it.",
      }),
    });
    const data = await res.json();
    const guidance = data.content ?? "Unable to analyze. As a default: do not agree to anything until you receive the details in writing.";

    const riskMatch = guidance.match(/high/i) ? "High" : guidance.match(/medium/i) ? "Medium" : "Low";

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: saved } = await supabase.from("decision_records").insert({
      user_id: userId, decision_text: text, risk_level: riskMatch, mina_guidance: guidance,
    }).select().single();
    return saved ?? null;
  } catch { return null; }
}

const riskColor = (r: string) => r === "High" ? "#ef4444" : r === "Medium" ? "#f59e0b" : "#22c55e";

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
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
    loadDecisions().then(setDecisions);
  }, []);

  const handleSubmit = async () => {
    if (!text.trim() || !userId) return;
    setLoading(true);
    const result = await analyzeDecision(text.trim(), userId);
    if (result) setDecisions(prev => [result, ...prev]);
    setText(""); setShowForm(false); setLoading(false);
  };

  return (
    <div style={{ background: "#090D1A", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "24px 16px" }}>

        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#8892A4", fontSize: "14px", textDecoration: "none", marginBottom: "32px" }}>
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <p style={{ color: "#f59e0b", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "8px" }}>Decision Shield</p>
            <h1 style={{ color: "#F0F4FF", fontSize: "clamp(1.5rem, 5vw, 2rem)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>Before You Decide</h1>
          </div>
          <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "10px", background: "#f59e0b", border: "none", color: "#090D1A", fontSize: "13px", fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
            <Plus size={14} /> Analyze
          </button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: "20px", borderRadius: "16px", background: "#111827", border: "1px solid rgba(245,158,11,0.2)", marginBottom: "24px" }}>
            <p style={{ color: "#f59e0b", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px" }}>Paste the offer or decision</p>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={5}
              placeholder="Paste the settlement offer, payment plan, or decision you are considering..."
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#F0F4FF", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button onClick={handleSubmit} disabled={!text.trim() || loading}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px", borderRadius: "10px", background: text.trim() && !loading ? "#f59e0b" : "rgba(255,255,255,0.06)", border: "none", color: text.trim() && !loading ? "#090D1A" : "#8892A4", fontSize: "14px", fontWeight: 700, cursor: text.trim() && !loading ? "pointer" : "not-allowed" }}>
                {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Analyzing...</> : <><ShieldCheck size={14} /> Analyze with Mina</>}
              </button>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#8892A4", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
            </div>
          </motion.div>
        )}

        {decisions.length === 0 && !showForm ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <ShieldCheck size={24} style={{ color: "#f59e0b" }} />
            </div>
            <p style={{ color: "#F0F4FF", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>No decisions analyzed yet</p>
            <p style={{ color: "#8892A4", fontSize: "14px", lineHeight: 1.6 }}>Paste any settlement offer, payment plan, or financial decision before you agree to it. Mina will analyze the risk and tell you what to watch for.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {decisions.map(d => (
              <motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ padding: "16px 20px", borderRadius: "14px", background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <p style={{ color: "#F0F4FF", fontSize: "14px", fontWeight: 600 }}>Decision analysis</p>
                  <span style={{ padding: "3px 10px", borderRadius: "20px", background: `${riskColor(d.risk_level)}15`, color: riskColor(d.risk_level), fontSize: "12px", fontWeight: 700 }}>{d.risk_level} risk</span>
                </div>
                <p style={{ color: "#8892A4", fontSize: "13px", marginBottom: "10px", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{d.decision_text.length > 120 ? d.decision_text.slice(0, 120) + "..." : d.decision_text}</p>
                <p style={{ color: "#F0F4FF", fontSize: "14px", lineHeight: 1.6, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>{d.mina_guidance}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
