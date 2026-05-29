"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Phone, Sparkles, Radio, AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import CallWaveform from "./CallWaveform";

const SCENARIO = [
  { id: "incoming", label: "Incoming Call", sub: "Portfolio Recovery Associates", color: "#ef4444", type: "header" },
  { id: "collector", label: "Collector", text: '"We may proceed with legal action if payment is not received today."', color: "#ef4444", type: "speech" },
  { id: "detect", label: "Pressure tactic detected", sub: "Urgency + legal threat", confidence: 94, color: "#f59e0b", type: "alert" },
  { id: "mina", label: "Mina", text: "Can you send that information in writing?", color: "#C9A84C", type: "mina" },
  { id: "suggest", label: "Suggested response", text: '"Please send the details in writing and I will review them within 30 days."', color: "#C9A84C", type: "suggest" },
];

function AnimatedScenario() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % SCENARIO.length), 2800);
    return () => clearInterval(t);
  }, []);
  const cur = SCENARIO[step];
  return (
    <div className="rounded-xl flex flex-col gap-4 p-4"
      style={{ background: "rgba(0,0,0,0.22)", border: "1px solid rgba(201,168,76,0.12)" }}>
      {/* Live bar */}
      <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.1, repeat: Infinity }}
          className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#ef4444" }} />
        <span className="text-xs font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(239,68,68,0.7)" }}>Live</span>
        <div className="flex-1"><CallWaveform /></div>
        {cur.type === "alert" && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(0,201,167,0.1)", color: "var(--teal)", border: "1px solid rgba(0,201,167,0.2)" }}>
            {cur.confidence}% confidence
          </span>
        )}
      </div>
      {/* Animated step */}
      <AnimatePresence mode="wait">
        <motion.div key={cur.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }} className="min-h-[76px] flex flex-col justify-center gap-1.5">
          {cur.type === "header" && (
            <>
              <span className="text-xs font-bold uppercase tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif", color: cur.color }}>{cur.label}</span>
              <p className="text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>{cur.sub}</p>
            </>
          )}
          {cur.type === "speech" && (
            <>
              <span className="text-xs font-bold uppercase tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif", color: cur.color }}>{cur.label}</span>
              <div className="px-3 py-2 rounded-lg text-sm" style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", color: "var(--text-prime)" }}>{cur.text}</div>
            </>
          )}
          {cur.type === "alert" && (
            <div className="flex items-center gap-2.5 px-3 py-3 rounded-lg" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)" }}>
              <AlertTriangle size={14} style={{ color: "#f59e0b", flexShrink: 0 }} />
              <div>
                <p className="text-xs font-bold" style={{ fontFamily: "'DM Sans', sans-serif", color: "#f59e0b" }}>{cur.label}</p>
                <p className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(245,158,11,0.6)" }}>{cur.sub}</p>
              </div>
            </div>
          )}
          {cur.type === "mina" && (
            <>
              <span className="text-xs font-bold uppercase tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif", color: cur.color }}>{cur.label}</span>
              <div className="flex items-start gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
                <Sparkles size={12} className="mt-0.5 flex-shrink-0" style={{ color: "#C9A84C" }} />
                <p className="text-sm italic" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>{cur.text}</p>
              </div>
            </>
          )}
          {cur.type === "suggest" && (
            <>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} style={{ color: "var(--teal)" }} />
                <span className="text-xs font-bold uppercase tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>{cur.label}</span>
              </div>
              <div className="px-3 py-2.5 rounded-lg text-sm" style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(0,201,167,0.07)", border: "1px solid rgba(0,201,167,0.2)", color: "var(--text-prime)" }}>{cur.text}</div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
      {/* Dots */}
      <div className="flex justify-center gap-1.5">
        {SCENARIO.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} className="rounded-full transition-all"
            style={{ width: i === step ? "16px" : "6px", height: "6px", background: i === step ? "#C9A84C" : "rgba(255,255,255,0.1)" }} />
        ))}
      </div>
    </div>
  );
}

export default function LiveCallCenter() {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="text-xs font-semibold tracking-widest uppercase px-3"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
          Live Call Center
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* LEFT — Current capability */}
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="flex flex-col gap-5 p-6 rounded-2xl"
          style={{ background: "var(--bg-card)", border: "1px solid rgba(0,201,167,0.22)" }}>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,201,167,0.12)" }}>
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
              <p className="text-sm mt-1.5 leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
                Type what the caller says. Mina gives you the exact words to respond — in real time, before you speak.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 px-4 py-3.5 rounded-xl"
            style={{ background: "rgba(0,201,167,0.05)", border: "1px solid rgba(0,201,167,0.12)" }}>
            {["Exact phrases for every collector tactic", "Pressure detection in real time", "Record of what was said", "What you are legally required to say — and what you are not"].map(item => (
              <div key={item} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "var(--teal)" }} />
                <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>{item}</p>
              </div>
            ))}
          </div>
          <Link href="/live-call"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all"
            style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--teal)", color: "#090D1A", boxShadow: "0 0 24px rgba(0,201,167,0.2)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#00ddb8"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--teal)"; }}>
            <Phone size={15} />
            Start Live Call Assistant
          </Link>
        </motion.div>

        {/* RIGHT — Future flagship */}
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="relative flex flex-col gap-5 p-6 rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0D1120 0%, #0F1420 55%, rgba(201,168,76,0.06) 100%)", border: "1px solid rgba(201,168,76,0.4)", boxShadow: "0 0 60px rgba(201,168,76,0.08), 0 20px 50px rgba(0,0,0,0.4)" }}>
          <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 65%)", transform: "translate(25%,-25%)" }} />
          <div className="relative z-10 flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(201,168,76,0.14)" }}>
                  <Radio size={22} style={{ color: "#C9A84C" }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
                    Call Through Mina
                  </h3>
                  <p className="text-sm mt-1.5 leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
                    Mina joins the call, listens, detects pressure, and tells you exactly what to say — in real time.
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.28)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.1)"; }}>
              Preview Future Call
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
