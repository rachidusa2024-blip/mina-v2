"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, MountainSnow, Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const STAGES = [
  { key: "stabilize", label: "Stabilize", desc: "Slow the panic" },
  { key: "understand", label: "Understand", desc: "Know what is real" },
  { key: "protect", label: "Protect", desc: "Avoid costly mistakes" },
  { key: "act", label: "Act", desc: "Take control" },
  { key: "resolve", label: "Resolve", desc: "Reduce pressure" },
  { key: "recover", label: "Recover", desc: "Rebuild confidence" },
];

interface RecoveryRecord { id: string; current_stage: string; readiness_score: number; notes: string; }

async function loadRecord(): Promise<RecoveryRecord | null> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("recovery_records").select("*").eq("user_id", user.id).single();
    return data ?? null;
  } catch { return null; }
}

async function saveRecord(stage: string, score: number, userId: string) {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: existing } = await supabase.from("recovery_records").select("id").eq("user_id", userId).single();
    if (existing) {
      await supabase.from("recovery_records").update({ current_stage: stage, readiness_score: score, updated_at: new Date().toISOString() }).eq("user_id", userId);
    } else {
      await supabase.from("recovery_records").insert({ user_id: userId, current_stage: stage, readiness_score: score });
    }
  } catch {}
}

export default function RecoveryPage() {
  const [record, setRecord] = useState<RecoveryRecord | null>(null);
  const [stage, setStage] = useState("stabilize");
  const [userId, setUserId] = useState<string | null>(null);
  const currentIdx = STAGES.findIndex(s => s.key === stage);
  const progress = Math.round(((currentIdx + 1) / STAGES.length) * 100);

  useEffect(() => {
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserId(user.id);
      } catch {}
      const rec = await loadRecord();
      if (rec) { setRecord(rec); setStage(rec.current_stage); }
    })();
  }, []);

  const advanceStage = async () => {
    if (currentIdx < STAGES.length - 1) {
      const nextStage = STAGES[currentIdx + 1].key;
      setStage(nextStage);
      if (userId) await saveRecord(nextStage, Math.min(progress + 15, 100), userId);
    }
  };

  return (
    <div style={{ background: "#090D1A", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px" }}>
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#8892A4", fontSize: "14px", textDecoration: "none", marginBottom: "32px" }}>
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div style={{ marginBottom: "32px" }}>
          <p style={{ color: "#22c55e", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "8px" }}>Recovery</p>
          <h1 style={{ color: "#F0F4FF", fontSize: "clamp(1.5rem, 5vw, 2rem)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>Getting Your Life Back</h1>
        </div>

        {/* Progress */}
        <div style={{ padding: "20px 24px", borderRadius: "16px", background: "#111827", border: "1px solid rgba(34,197,94,0.2)", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Progress</span>
            <span style={{ color: "#22c55e", fontSize: "20px", fontWeight: 700 }}>{progress}%</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "99px", height: "6px", overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.2 }}
              style={{ height: "100%", borderRadius: "99px", background: "linear-gradient(to right, rgba(34,197,94,0.5), #22c55e)" }} />
          </div>
          <p style={{ color: "#8892A4", fontSize: "13px", marginTop: "12px" }}>
            Current stage: <strong style={{ color: "#F0F4FF" }}>{STAGES[currentIdx]?.label}</strong> — {STAGES[currentIdx]?.desc}
          </p>
        </div>

        {/* Journey */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "32px" }}>
          {STAGES.map((s, i) => {
            const isPast = i < currentIdx;
            const isCurrent = i === currentIdx;
            return (
              <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", borderRadius: "12px", background: isCurrent ? "rgba(34,197,94,0.08)" : "transparent", border: `1px solid ${isCurrent ? "rgba(34,197,94,0.2)" : "transparent"}` }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: isPast ? "#22c55e" : isCurrent ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${isPast ? "#22c55e" : isCurrent ? "#22c55e" : "rgba(255,255,255,0.1)"}`, flexShrink: 0 }}>
                  {isPast ? <Check size={12} style={{ color: "#090D1A" }} /> : <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: isCurrent ? "#22c55e" : "rgba(255,255,255,0.2)" }} />}
                </div>
                <div>
                  <p style={{ color: isCurrent ? "#22c55e" : isPast ? "#8892A4" : "rgba(136,146,164,0.35)", fontSize: "14px", fontWeight: isCurrent ? 600 : 400 }}>{s.label}</p>
                  <p style={{ color: isCurrent ? "rgba(34,197,94,0.6)" : "rgba(136,146,164,0.25)", fontSize: "12px" }}>{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {currentIdx < STAGES.length - 1 ? (
          <button onClick={advanceStage} style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "#22c55e", border: "none", color: "#090D1A", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
            Mark "{STAGES[currentIdx + 1]?.label}" as next step →
          </button>
        ) : (
          <div style={{ textAlign: "center", padding: "20px", borderRadius: "14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <MountainSnow size={28} style={{ color: "#22c55e", marginBottom: "8px" }} />
            <p style={{ color: "#F0F4FF", fontSize: "16px", fontWeight: 600 }}>Recovery complete.</p>
            <p style={{ color: "#8892A4", fontSize: "14px", marginTop: "4px" }}>You made it through.</p>
          </div>
        )}
      </div>
    </div>
  );
}
