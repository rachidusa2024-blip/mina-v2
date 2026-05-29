"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface TimelineEvent { id: string; event_type: string; title: string; description: string; source_feature: string; created_at: string; }

const EVENT_TYPES = ["Collector call", "Document received", "Letter sent", "Decision made", "Recovery milestone", "Legal notice", "Other"];

async function loadEvents(): Promise<TimelineEvent[]> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase.from("timeline_events").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    return data ?? [];
  } catch { return []; }
}

async function saveEvent(title: string, eventType: string, description: string, userId: string): Promise<TimelineEvent | null> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data } = await supabase.from("timeline_events").insert({ user_id: userId, event_type: eventType, title, description, source_feature: "manual" }).select().single();
    return data ?? null;
  } catch { return null; }
}

const typeColor: Record<string, string> = {
  "Collector call": "#ef4444", "Document received": "#f59e0b", "Letter sent": "#C9A84C",
  "Decision made": "#818CF8", "Recovery milestone": "#22c55e", "Legal notice": "#f97316", "Other": "#8892A4",
};

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("Collector call");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserId(user.id);
      } catch {}
      loadEvents().then(setEvents);
    })();
  }, []);

  const handleSave = async () => {
    if (!title.trim() || !userId) return;
    setSaving(true);
    const saved = await saveEvent(title.trim(), eventType, description.trim(), userId);
    if (saved) setEvents(prev => [saved, ...prev]);
    setTitle(""); setDescription(""); setEventType("Collector call"); setShowForm(false); setSaving(false);
  };

  return (
    <div style={{ background: "#090D1A", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "24px 16px" }}>
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#8892A4", fontSize: "14px", textDecoration: "none", marginBottom: "32px" }}>
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <p style={{ color: "#818CF8", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "8px" }}>Timeline</p>
            <h1 style={{ color: "#F0F4FF", fontSize: "clamp(1.5rem, 5vw, 2rem)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>What Happened So Far</h1>
          </div>
          <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "10px", background: "#818CF8", border: "none", color: "#090D1A", fontSize: "13px", fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
            <Plus size={14} /> Add Event
          </button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: "20px", borderRadius: "16px", background: "#111827", border: "1px solid rgba(129,140,248,0.2)", marginBottom: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <select value={eventType} onChange={e => setEventType(e.target.value)}
                style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#F0F4FF", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What happened? (brief title)"
                style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#F0F4FF", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Details (optional)"
                style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#F0F4FF", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "vertical" }} />
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleSave} disabled={!title.trim() || saving}
                  style={{ flex: 1, padding: "10px", borderRadius: "10px", background: title.trim() && !saving ? "#818CF8" : "rgba(255,255,255,0.06)", border: "none", color: title.trim() && !saving ? "#090D1A" : "#8892A4", fontSize: "14px", fontWeight: 700, cursor: title.trim() && !saving ? "pointer" : "not-allowed" }}>
                  {saving ? "Saving..." : "Save Event"}
                </button>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#8892A4", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          </motion.div>
        )}

        {events.length === 0 && !showForm ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(129,140,248,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Clock size={24} style={{ color: "#818CF8" }} />
            </div>
            <p style={{ color: "#F0F4FF", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>No events yet</p>
            <p style={{ color: "#8892A4", fontSize: "14px", lineHeight: 1.6 }}>Add the events that have already happened — collector calls, letters received, decisions made. Building a timeline helps Mina understand the full picture.</p>
          </div>
        ) : (
          <div style={{ position: "relative", paddingLeft: "24px" }}>
            <div style={{ position: "absolute", left: "8px", top: "8px", bottom: "8px", width: "2px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }} />
            {events.map((e, i) => {
              const color = typeColor[e.event_type] ?? "#8892A4";
              return (
                <motion.div key={e.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ position: "relative", marginBottom: "20px", paddingLeft: "16px" }}>
                  <div style={{ position: "absolute", left: "-24px", top: "12px", width: "12px", height: "12px", borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}60` }} />
                  <div style={{ padding: "14px 18px", borderRadius: "12px", background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{e.event_type}</span>
                      <span style={{ color: "#8892A4", fontSize: "11px" }}>{new Date(e.created_at).toLocaleDateString()}</span>
                    </div>
                    <p style={{ color: "#F0F4FF", fontSize: "14px", fontWeight: 600 }}>{e.title}</p>
                    {e.description && <p style={{ color: "#8892A4", fontSize: "13px", marginTop: "4px" }}>{e.description}</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
