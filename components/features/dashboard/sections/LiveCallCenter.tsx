"use client";

import { motion } from "framer-motion";
import { Headphones, Phone, Sparkles, Radio } from "lucide-react";
import Link from "next/link";
import CallWaveform from "./CallWaveform";

export default function LiveCallCenter() {
  return (
    <section className="flex flex-col gap-5">
      {/* Section label */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span
          className="text-xs font-semibold tracking-widest uppercase px-3"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
        >
          Live Call Center
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT — Live Call Assistant (current) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="flex flex-col gap-5 p-6 rounded-2xl"
          style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(0,201,167,0.2)",
          }}
        >
          {/* Header */}
          <div className="flex items-start gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,201,167,0.1)" }}
            >
              <Headphones size={20} style={{ color: "var(--teal)" }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className="text-base font-semibold"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}
                >
                  Live Call Assistant
                </h3>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background: "rgba(0,201,167,0.12)",
                    color: "var(--teal)",
                    border: "1px solid rgba(0,201,167,0.25)",
                  }}
                >
                  Available now
                </span>
              </div>
              <p
                className="text-sm mt-1"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
              >
                Type what the caller says. Mina gives you exact words to respond.
              </p>
            </div>
          </div>

          {/* Mini demo */}
          <div
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            {/* Caller */}
            <div className="flex flex-col gap-1">
              <span
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(239,68,68,0.7)" }}
              >
                Caller
              </span>
              <div
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.15)",
                  color: "var(--text-prime)",
                }}
              >
                "We need payment today."
              </div>
            </div>

            {/* Mina response */}
            <div className="flex flex-col gap-1">
              <span
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}
              >
                Mina
              </span>
              <div
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: "rgba(0,201,167,0.07)",
                  border: "1px solid rgba(0,201,167,0.2)",
                  color: "var(--text-prime)",
                }}
              >
                Ask for written details before agreeing.
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/live-call"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: "var(--teal)",
              color: "#090D1A",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#00ddb8"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--teal)"; }}
          >
            <Phone size={15} />
            Start Live Call Assistant
          </Link>
        </motion.div>

        {/* RIGHT — Call Through Mina (future, investor-grade) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="relative flex flex-col gap-5 p-6 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0F1623 0%, rgba(201,168,76,0.05) 100%)",
            border: "1px solid rgba(201,168,76,0.35)",
            boxShadow: "0 0 40px rgba(201,168,76,0.06)",
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
              transform: "translate(20%, -20%)",
            }}
          />

          <div className="relative z-10 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(201,168,76,0.12)" }}
                >
                  <Radio size={20} style={{ color: "#C9A84C" }} />
                </div>
                <div>
                  <h3
                    className="text-base font-semibold"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}
                  >
                    Call Through Mina
                  </h3>
                  <p
                    className="text-sm mt-1"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
                  >
                    Future flagship capability.
                  </p>
                </div>
              </div>

              <span
                className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: "rgba(201,168,76,0.15)",
                  color: "#C9A84C",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
              >
                Coming soon
              </span>
            </div>

            {/* Phone UI preview */}
            <div
              className="rounded-xl p-4 flex flex-col gap-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.12)" }}
            >
              {/* Phone number input */}
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <Phone size={14} style={{ color: "rgba(201,168,76,0.5)" }} />
                <span
                  className="text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.4)" }}
                >
                  +1 (800) 000-0000
                </span>
                <span
                  className="ml-auto text-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.3)" }}
                >
                  Collector
                </span>
              </div>

              {/* Waveform */}
              <div className="flex flex-col gap-1.5">
                <span
                  className="text-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(201,168,76,0.5)" }}
                >
                  Live audio
                </span>
                <CallWaveform />
              </div>

              {/* Transcript preview */}
              <div className="flex flex-col gap-2">
                <span
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.4)" }}
                >
                  Transcript
                </span>
                <div className="flex flex-col gap-1.5 opacity-50">
                  {[
                    { who: "Caller", text: "We need payment today or we'll be forced to—", color: "rgba(239,68,68,0.6)" },
                    { who: "Mina", text: "Pause. Do not agree. Request debt validation.", color: "rgba(201,168,76,0.7)" },
                  ].map((line) => (
                    <div key={line.who} className="flex items-start gap-2">
                      <span
                        className="text-xs font-semibold flex-shrink-0"
                        style={{ fontFamily: "'DM Sans', sans-serif", color: line.color }}
                      >
                        {line.who}:
                      </span>
                      <span
                        className="text-xs"
                        style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
                      >
                        {line.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mina suggestion */}
              <div
                className="flex items-start gap-2 p-3 rounded-lg"
                style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)" }}
              >
                <Sparkles size={12} className="mt-0.5 flex-shrink-0" style={{ color: "#C9A84C" }} />
                <p
                  className="text-xs leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(201,168,76,0.9)" }}
                >
                  "Please send that in writing. I will respond within 30 days."
                </p>
              </div>
            </div>

            {/* Description */}
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
            >
              Future version: start calls through Mina. Mina listens, transcribes, detects pressure, and writes exactly what to say in real time.
            </p>

            {/* CTA */}
            <Link
              href="/call-through-mina"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: "rgba(201,168,76,0.1)",
                color: "#C9A84C",
                border: "1px solid rgba(201,168,76,0.25)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.18)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.1)"; }}
            >
              Preview Future Call
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
