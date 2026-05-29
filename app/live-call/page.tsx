"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Phone, Send, Loader2, AlertTriangle, ShieldCheck, PhoneOff } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Turn { callerSaid: string; tactic: string; sayThis: string; note: string; }

async function saveSession(turns: Turn[], callerName: string, userId: string) {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const transcript = turns.map(t => ({ caller: t.callerSaid, mina: t.sayThis }));
    const pressure_flags = turns.filter(t => t.tactic !== "None detected").map(t => t.tactic);
    await supabase.from("live_call_sessions").insert({
      user_id: userId, caller_name: callerName, status: "complete",
      transcript, pressure_flags, mina_suggestions: turns.map(t => t.sayThis),
    });
  } catch {}
}

export default function LiveCallPage() {
  const [phase, setPhase] = useState<"setup" | "active" | "done">("setup");
  const [callerName, setCallerName] = useState("");
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserId(user.id);
      } catch {}
    })();
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [turns]);

  const startCall = () => { if (callerName.trim()) setPhase("active"); };

  const sendTurn = async () => {
    if (!input.trim() || loading) return;
    const callerSaid = input.trim();
    setInput("");
    setLoading(true);

    const history = turns.map(t => [
      { role: "user" as const, content: `Collector said: "${t.callerSaid}"` },
      { role: "assistant" as const, content: `TACTIC: ${t.tactic}\nSAY THIS: "${t.sayThis}"\nNOTE: ${t.note}` },
    ]).flat();

    try {
      const res = await fetch("/api/live-call", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callerStatement: callerSaid, callHistory: history }),
      });
      const data = await res.json();
      setTurns(prev => [...prev, { callerSaid, tactic: data.tactic, sayThis: data.sayThis, note: data.note }]);
    } catch {
      setTurns(prev => [...prev, { callerSaid, tactic: "Unable to analyze", sayThis: "Please send that information in writing.", note: "Use this response — it is always safe." }]);
    }
    setLoading(false);
  };

  const endCall = async () => {
    if (userId && turns.length > 0) await saveSession(turns, callerName, userId);
    setPhase("done");
  };

  if (phase === "setup") return (
    <div style={{ background: "#090D1A", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px" }}>
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#8892A4", fontSize: "14px", textDecoration: "none", marginBottom: "32px" }}>
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
        <div style={{ marginBottom: "32px" }}>
          <p style={{ color: "#00C9A7", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "8px" }}>Live Call Assistant</p>
          <h1 style={{ color: "#F0F4FF", fontSize: "clamp(1.5rem, 5vw, 2rem)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2, marginBottom: "12px" }}>Mina is ready when you are.</h1>
          <p style={{ color: "#8892A4", fontSize: "14px", lineHeight: 1.6 }}>Type what the collector says. Mina gives you the exact words to respond — and flags any pressure tactics.</p>
        </div>
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", color: "#8892A4", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Who is calling?</label>
          <input value={callerName} onChange={e => setCallerName(e.target.value)} onKeyDown={e => e.key === "Enter" && startCall()}
            placeholder="e.g. Portfolio Recovery Associates"
            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", background: "#111827", border: "1px solid rgba(255,255,255,0.08)", color: "#F0F4FF", fontSize: "15px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }} />
        </div>
        <button onClick={startCall} disabled={!callerName.trim()}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px", borderRadius: "12px", background: callerName.trim() ? "#00C9A7" : "rgba(255,255,255,0.06)", border: "none", color: callerName.trim() ? "#090D1A" : "#8892A4", fontSize: "15px", fontWeight: 700, cursor: callerName.trim() ? "pointer" : "not-allowed" }}>
          <Phone size={16} /> Start Session
        </button>
      </div>
    </div>
  );

  if (phase === "done") return (
    <div style={{ background: "#090D1A", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ padding: "32px 24px", borderRadius: "20px", background: "rgba(0,201,167,0.06)", border: "1px solid rgba(0,201,167,0.18)", marginBottom: "24px", textAlign: "center" }}>
          <ShieldCheck size={32} style={{ color: "#00C9A7", marginBottom: "16px" }} />
          <h2 style={{ color: "#F0F4FF", fontSize: "1.5rem", fontFamily: "'Cormorant Garamond', serif", marginBottom: "8px" }}>Call complete.</h2>
          <p style={{ color: "#8892A4", fontSize: "14px", lineHeight: 1.6 }}>{turns.length} exchange{turns.length !== 1 ? "s" : ""} recorded. {turns.filter(t => t.tactic !== "None detected").length} pressure tactic{turns.filter(t => t.tactic !== "None detected").length !== 1 ? "s" : ""} detected.</p>
        </div>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px", borderRadius: "12px", background: "#00C9A7", color: "#090D1A", fontSize: "15px", fontWeight: 700, textDecoration: "none" }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#090D1A", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10, background: "rgba(9,13,26,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 16px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
            <span style={{ color: "#F0F4FF", fontSize: "13px", fontWeight: 600 }}>{callerName}</span>
          </div>
          <button onClick={endCall} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
            <PhoneOff size={13} /> End Call
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "80px 16px 140px", maxWidth: "640px", margin: "0 auto", width: "100%" }}>
        {turns.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ color: "#8892A4", fontSize: "14px", lineHeight: 1.6 }}>Type the first thing the collector says below. Mina will tell you exactly how to respond.</p>
          </div>
        )}
        {turns.map((turn, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "24px" }}>
            <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)", marginBottom: "12px" }}>
              <p style={{ color: "rgba(239,68,68,0.7)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "4px" }}>Collector</p>
              <p style={{ color: "#F0F4FF", fontSize: "14px" }}>{turn.callerSaid}</p>
            </div>
            {turn.tactic !== "None detected" && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "8px", background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", marginBottom: "8px" }}>
                <AlertTriangle size={13} style={{ color: "#f59e0b", flexShrink: 0 }} />
                <p style={{ color: "#f59e0b", fontSize: "12px" }}>{turn.tactic}</p>
              </div>
            )}
            <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(0,201,167,0.07)", border: "1px solid rgba(0,201,167,0.2)" }}>
              <p style={{ color: "#00C9A7", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "4px" }}>Say this</p>
              <p style={{ color: "#F0F4FF", fontSize: "15px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>"{turn.sayThis}"</p>
              {turn.note && <p style={{ color: "#8892A4", fontSize: "12px", marginTop: "8px" }}>{turn.note}</p>}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Loader2 size={14} style={{ color: "#00C9A7", animation: "spin 1s linear infinite" }} />
            <span style={{ color: "#8892A4", fontSize: "13px" }}>Mina is analyzing...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(9,13,26,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px 24px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", display: "flex", gap: "12px" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendTurn()}
            placeholder="Type what the collector says..."
            style={{ flex: 1, padding: "12px 16px", borderRadius: "12px", background: "#111827", border: "1px solid rgba(255,255,255,0.08)", color: "#F0F4FF", fontSize: "15px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
          <button onClick={sendTurn} disabled={!input.trim() || loading}
            style={{ width: "48px", height: "48px", borderRadius: "12px", background: input.trim() && !loading ? "#00C9A7" : "rgba(255,255,255,0.06)", border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Send size={17} style={{ color: input.trim() && !loading ? "#090D1A" : "#8892A4" }} />
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
