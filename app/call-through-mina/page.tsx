"use client";

import { ArrowLeft, Radio, Mic, Sparkles, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CallThroughMinaPage() {
  return (
    <div style={{ background: "#090D1A", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px" }}>
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#8892A4", fontSize: "14px", textDecoration: "none", marginBottom: "32px" }}>
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ padding: "3px 10px", borderRadius: "20px", background: "rgba(201,168,76,0.15)", color: "#C9A84C", fontSize: "11px", fontWeight: 700, border: "1px solid rgba(201,168,76,0.3)" }}>Coming soon</span>
          </div>
          <h1 style={{ color: "#F0F4FF", fontSize: "clamp(1.6rem, 5vw, 2.2rem)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.15, marginBottom: "12px" }}>Call Through Mina</h1>
          <p style={{ color: "#8892A4", fontSize: "15px", lineHeight: 1.7 }}>Mina joins the call, listens in real time, detects pressure tactics, and tells you exactly what to say — before you say it.</p>
        </div>

        {/* Preview card */}
        <div style={{ borderRadius: "20px", background: "linear-gradient(145deg, #0D1120 0%, rgba(201,168,76,0.06) 100%)", border: "1px solid rgba(201,168,76,0.35)", boxShadow: "0 0 60px rgba(201,168,76,0.07)", padding: "24px", marginBottom: "32px" }}>
          {/* Live indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.1, repeat: Infinity }}
              style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
            <span style={{ color: "rgba(239,68,68,0.8)", fontSize: "12px", fontWeight: 600 }}>Live call in progress</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: "3px", alignItems: "center" }}>
              {[3, 6, 9, 12, 8, 5, 10, 14, 7].map((h, i) => (
                <div key={i} style={{ width: "3px", height: `${h}px`, borderRadius: "2px", background: "rgba(201,168,76,0.5)", animation: `waveBar 1.4s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>

          {/* Transcript preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
            <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <p style={{ color: "rgba(239,68,68,0.7)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "4px" }}>Collector</p>
              <p style={{ color: "#F0F4FF", fontSize: "14px" }}>"Legal action will begin if payment is not made today."</p>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertTriangle size={13} style={{ color: "#f59e0b" }} />
              <p style={{ color: "#f59e0b", fontSize: "12px", fontWeight: 600 }}>Pressure tactic — urgency + legal threat</p>
              <span style={{ marginLeft: "auto", color: "#00C9A7", fontSize: "12px", fontWeight: 700 }}>94%</span>
            </div>
            <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <Sparkles size={12} style={{ color: "#C9A84C", marginTop: "2px", flexShrink: 0 }} />
              <div>
                <p style={{ color: "#C9A84C", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Mina says</p>
                <p style={{ color: "#F0F4FF", fontSize: "14px", fontStyle: "italic" }}>"Please send that information in writing. I will review it within 30 days."</p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck size={13} style={{ color: "#22c55e" }} />
            <p style={{ color: "#22c55e", fontSize: "12px" }}>You are protected. Suggested response ready.</p>
          </div>
        </div>

        {/* How it will work */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ color: "#8892A4", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "16px" }}>How it will work</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {["You call through Mina — the collector calls your number", "Mina listens to both sides of the call in real time", "Pressure tactics are detected and flagged as they happen", "Mina writes your response before you need to say it", "The full call is summarized and saved for your records"].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#C9A84C", fontSize: "11px", fontWeight: 700 }}>{i + 1}</span>
                </div>
                <p style={{ color: "#8892A4", fontSize: "14px", lineHeight: 1.55, paddingTop: "2px" }}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        <Link href="/live-call" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px 24px", borderRadius: "12px", background: "#00C9A7", color: "#090D1A", fontSize: "15px", fontWeight: 700, textDecoration: "none" }}>
          Use Live Call Assistant now →
        </Link>
        <p style={{ color: "#8892A4", fontSize: "12px", textAlign: "center", marginTop: "12px" }}>The current version is available today.</p>
      </div>
      <style>{`@keyframes waveBar { 0%,100% { transform: scaleY(0.35); opacity: 0.35; } 50% { transform: scaleY(1); opacity: 1; } }`}</style>
    </div>
  );
}
