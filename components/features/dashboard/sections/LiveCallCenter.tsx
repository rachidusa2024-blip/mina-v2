"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Phone, Sparkles, Radio, AlertTriangle, ShieldCheck, Mic } from "lucide-react";
import Link from "next/link";
import CallWaveform from "./CallWaveform";

const SCENARIO = [
  { id: "call",    type: "header",  label: "Incoming Call",         sub: "Portfolio Recovery Associates",                                         color: "#ef4444" },
  { id: "speak",   type: "speech",  label: "Collector",             text: '"We may proceed with legal action if payment is not received today."',   color: "#ef4444" },
  { id: "detect",  type: "alert",   label: "Pressure tactic",       sub: "Urgency + legal threat combined",    confidence: 94,                     color: "#f59e0b" },
  { id: "mina",    type: "mina",    label: "Mina",                  text: "Can you send that information in writing?",                             color: "#C9A84C" },
  { id: "suggest", type: "suggest", label: "Say this",              text: '"Please send the details in writing. I will review them within 30 days."', color: "#00C9A7" },
];

function AnimatedScenario() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % SCENARIO.length), 3000);
    return () => clearInterval(t);
  }, []);
  const cur = SCENARIO[step];

  return (
    <div className="rounded-2xl flex flex-col gap-4 p-5"
      style={{ background: "rgba(0,0,0,0.28)", border: "1px solid rgba(201,168,76,0.14)" }}>

      {/* Status bar */}
      <div className="flex items-center gap-2.5 pb-3.5" style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <motion.div animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.1, repeat: Infinity }}
          className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#ef4444" }} />
        <span className="text-xs font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(239,68,68,0.75)" }}>
          Live call in progress
        </span>
        <div className="flex-1 mx-1">
          <CallWaveform />
        </div>
        <AnimatePresence mode="wait">
          {cur.type === "detect" && (
            <motion.span key="conf" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
              className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(0,201,167,0.12)", color: "var(--teal)", border: "1px solid rgba(0,201,167,0.25)" }}>
              {cur.confidence}%
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={cur.id}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-[88px] flex flex-col justify-center gap-2">

          {cur.type === "header" && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif", color: cur.color }}>
                {cur.label}
              </span>
              <p className="text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
                {cur.sub}
              </p>
              <p className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.5)" }}>
                Mina is listening
              </p>
            </div>
          )}

          {cur.type === "speech" && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif", color: cur.color }}>
                {cur.label}
              </span>
              <div className="px-3.5 py-2.5 rounded-xl text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", color: "var(--text-prime)", lineHeight: 1.55 }}>
                {cur.text}
              </div>
            </div>
          )}

          {cur.type === "alert" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl"
                style={{ background: "rgba(245,158,11,0.09)", border: "1px solid rgba(245,158,11,0.25)" }}>
                <AlertTriangle size={15} style={{ color: "#f59e0b", flexShrink: 0 }} />
                <div>
                  <p className="text-sm font-bold" style={{ fontFamily: "'DM Sans', sans-serif", color: "#f59e0b" }}>
                    {cur.label}
                  </p>
                  <p className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(245,158,11,0.6)" }}>
                    {cur.sub}
                  </p>
                </div>
                <div className="ml-auto flex flex-col items-end gap-0.5">
                  <span className="text-xs font-bold" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>{cur.confidence}%</span>
                  <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.5)" }}>confidence</span>
                </div>
              </div>
            </div>
          )}

          {cur.type === "mina" && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif", color: cur.color }}>
                {cur.label}
              </span>
              <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
                style={{ background: "rgba(201,168,76,0.09)", border: "1px solid rgba(201,168,76,0.22)" }}>
                <Sparkles size={13} className="mt-0.5 flex-shrink-0" style={{ color: "#C9A84C" }} />
                <p className="text-sm italic" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)", lineHeight: 1.55 }}>
                  {cur.text}
                </p>
              </div>
            </div>
          )}

          {cur.type === "suggest" && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} style={{ color: "var(--teal)" }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>
                  {cur.label}
                </span>
              </div>
              <div className="px-3.5 py-3 rounded-xl text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(0,201,167,0.08)", border: "1px solid rgba(0,201,167,0.25)", color: "var(--text-prime)", lineHeight: 1.55 }}>
                {cur.text}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {SCENARIO.map((_, i) => (
          <button key={i} onClick={() => setStep(i)}
            className="rounded-full transition-all duration-300"
            style={{ width: i === step ? "20px" : "6px", height: "6px", background: i === step ? "#C9A84C" : "rgba(255,255,255,0.1)" }} />
        ))}
      </div>
    </div>
  );
}

export default function LiveCallCenter() {
  return (
    <section className="flex flex-col gap-6">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--teal)" }} />
          <span className="text-xs font-semibold tracking-widest uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
            Live Call Center
          </span>
        </div>
        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT — Live Call Assistant */}
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="flex flex-col gap-6 p-7 rounded-2xl"
          style={{ background: "var(--bg-card)", border: "1px solid rgba(0,201,167,0.22)", boxShadow: "0 0 40px rgba(0,201,167,0.04)" }}>

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,201,167,0.12)", border: "1px solid rgba(0,201,167,0.2)" }}>
              <Headphones size={22} style={{ color: "var(--teal)" }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
                  Live Call Assistant
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(0,201,167,0.12)", color: "var(--teal)", border: "1px solid rgba(0,201,167,0.28)" }}>
                  Available now
                </span>
              </div>
              <p className="text-sm mt-2 leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
                Type what the collector says. Mina gives you the exact words to respond — before you speak.
              </p>
            </div>
          </div>

          {/* Live demo */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              { who: "Caller", text: '"We need payment today."', bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.12)", color: "rgba(239,68,68,0.65)" },
              { who: "Mina", text: "Ask for written details before agreeing to anything.", bg: "rgba(0,201,167,0.06)", border: "rgba(0,201,167,0.15)", color: "var(--teal)" },
            ].map((l, i) => (
              <div key={l.who} className={`px-4 py-3.5 ${i === 0 ? "" : ""}`}
                style={{ background: l.bg, borderBottom: i === 0 ? `1px solid rgba(255,255,255,0.04)` : "none" }}>
                <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif", color: l.color }}>{l.who}</p>
                <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)", lineHeight: 1.55 }}>{l.text}</p>
              </div>
            ))}
          </div>

          {/* Capabilities */}
          <div className="flex flex-col gap-2">
            {["Exact phrases for every collector tactic", "Real-time pressure detection", "Legal record of the conversation", "What you are and are not required to say"].map(item => (
              <div key={item} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "var(--teal)", opacity: 0.7 }} />
                <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>{item}</p>
              </div>
            ))}
          </div>

          <Link href="/live-call"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all"
            style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--teal)", color: "#090D1A", boxShadow: "0 0 28px rgba(0,201,167,0.22)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#00ddb8"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 36px rgba(0,201,167,0.32)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--teal)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(0,201,167,0.22)"; }}>
            <Phone size={15} />
            Start Live Call Assistant
          </Link>
        </motion.div>

        {/* RIGHT — Call Through Mina */}
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="relative flex flex-col gap-6 p-7 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #0D1120 0%, #0F1520 55%, rgba(201,168,76,0.07) 100%)",
            border: "1px solid rgba(201,168,76,0.42)",
            boxShadow: "0 0 70px rgba(201,168,76,0.09), 0 24px 60px rgba(0,0,0,0.45)",
          }}>
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 65%)", transform: "translate(25%,-25%)" }} />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(201,168,76,0.14)", border: "1px solid rgba(201,168,76,0.25)" }}>
                  <Radio size={22} style={{ color: "#C9A84C" }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
                    Call Through Mina
                  </h3>
                  <p className="text-sm mt-2 leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
                    Mina joins the call, listens in real time, detects pressure tactics, and tells you exactly what to say — before you say it.
                  </p>
                </div>
              </div>
              <span className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.32)" }}>
                Coming soon
              </span>
            </div>

            <AnimatedScenario />

            <Link href="/call-through-mina"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.1)"; }}>
              <Mic size={14} />
              Preview Future Call
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
