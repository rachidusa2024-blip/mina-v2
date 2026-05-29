"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Message { role: "user" | "mina"; content: string; }

async function saveMessage(sessionId: string, role: string, content: string, userId: string) {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.from("chat_messages").insert({ session_id: sessionId, user_id: userId, role, content });
  } catch {}
}

async function createSession(userId: string): Promise<string | null> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data } = await supabase.from("chat_sessions").insert({ user_id: userId, title: "New conversation" }).select("id").single();
    return data?.id ?? null;
  } catch { return null; }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "mina", content: "I'm here. What is on your mind right now?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Create session on first real message
    let sid = sessionId;
    if (!sid && userId) {
      sid = await createSession(userId);
      setSessionId(sid);
    }

    try {
      const apiMessages = messages
        .filter(m => m.role !== "mina" || messages.indexOf(m) > 0)
        .concat(userMsg)
        .map(m => ({ role: m.role === "mina" ? "assistant" : "user", content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      const minaMsg: Message = { role: "mina", content: data.content ?? "I'm sorry, I had trouble responding. Please try again." };
      setMessages(prev => [...prev, minaMsg]);

      if (sid && userId) {
        await saveMessage(sid, "user", userMsg.content, userId);
        await saveMessage(sid, "mina", minaMsg.content, userId);
      }
    } catch {
      setMessages(prev => [...prev, { role: "mina", content: "I'm temporarily unavailable. Please try again in a moment." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "#090D1A", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10, background: "rgba(9,13,26,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 16px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#8892A4", fontSize: "14px", textDecoration: "none" }}>
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00C9A7" }} />
            <span style={{ color: "#00C9A7", fontSize: "13px", fontWeight: 600 }}>Mina Coach</span>
          </div>
          <button onClick={() => { setMessages([{ role: "mina", content: "I'm here. What is on your mind right now?" }]); setSessionId(null); }}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8892A4", fontSize: "12px", cursor: "pointer" }}>
            <Plus size={13} /> New
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "80px 16px 140px", maxWidth: "640px", margin: "0 auto", width: "100%" }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: "16px" }}>
              {msg.role === "mina" && <span style={{ color: "#00C9A7", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>Mina</span>}
              <div style={{
                maxWidth: "80%", padding: "12px 16px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                background: msg.role === "user" ? "rgba(0,201,167,0.12)" : "#111827",
                border: msg.role === "user" ? "1px solid rgba(0,201,167,0.25)" : "1px solid rgba(255,255,255,0.06)",
                color: "#F0F4FF", fontSize: "15px", lineHeight: 1.6,
                fontFamily: msg.role === "mina" ? "'Cormorant Garamond', serif" : "'DM Sans', sans-serif",
              }}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Loader2 size={14} style={{ color: "#00C9A7", animation: "spin 1s linear infinite" }} />
            <span style={{ color: "#8892A4", fontSize: "13px" }}>Mina is thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(9,13,26,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px 24px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", display: "flex", gap: "12px" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Type what is on your mind..."
            style={{ flex: 1, padding: "12px 16px", borderRadius: "12px", background: "#111827", border: "1px solid rgba(255,255,255,0.08)", color: "#F0F4FF", fontSize: "15px", fontFamily: "'DM Sans', sans-serif", outline: "none" }}
          />
          <button onClick={send} disabled={!input.trim() || loading}
            style={{ width: "48px", height: "48px", borderRadius: "12px", background: input.trim() && !loading ? "#00C9A7" : "rgba(255,255,255,0.06)", border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Send size={17} style={{ color: input.trim() && !loading ? "#090D1A" : "#8892A4" }} />
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
