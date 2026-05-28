"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, AlertTriangle, Sparkles, CheckCircle, XCircle, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    id: 0,
    type: "call",
    icon: Phone,
    iconColor: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    label: "Incoming Call",
    labelColor: "#ef4444",
    primary: "Debt Collector",
    secondary: "Portfolio Recovery Associates",
  },
  {
    id: 1,
    type: "alert",
    icon: AlertTriangle,
    iconColor: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    label: "Pressure Detected",
    labelColor: "#f59e0b",
    primary: "Pressure rising",
    secondary: "Collector may use urgency tactics",
  },
  {
    id: 2,
    type: "mina",
    icon: Sparkles,
    iconColor: "#00C9A7",
    bg: "rgba(0,201,167,0.08)",
    border: "rgba(0,201,167,0.25)",
    label: "Mina",
    labelColor: "#00C9A7",
    primary: "Pause before agreeing.",
    secondary: "You are not required to decide right now.",
  },
  {
    id: 3,
    type: "say",
    icon: CheckCircle,
    iconColor: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.25)",
    label: "Say this",
    labelColor: "#22c55e",
    primary: '"Please send the details in writing',
    secondary: 'before I make any decision."',
  },
  {
    id: 4,
    type: "avoid",
    icon: XCircle,
    iconColor: "#ef4444",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.2)",
    label: "Avoid saying",
    labelColor: "#ef4444",
    primary: '"I agree to pay today."',
    secondary: "This may restart the statute of limitations.",
    strikethrough: true,
  },
  {
    id: 5,
    type: "done",
    icon: ShieldCheck,
    iconColor: "#00C9A7",
    bg: "rgba(0,201,167,0.08)",
    border: "rgba(0,201,167,0.2)",
    label: "Call complete",
    labelColor: "#00C9A7",
    primary: "Key points saved.",
    secondary: "Your next step has been prepared.",
  },
];

const DURATION = 2800; // ms per step

export default function CallSequence() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, DURATION);
    return () => clearInterval(timer);
  }, []);

  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Step dots */}
      <div className="flex items-center gap-1.5 justify-center mb-1">
        {STEPS.map((s) => (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            className="rounded-full transition-all duration-300"
            style={{
              width: step === s.id ? "18px" : "6px",
              height: "6px",
              background: step === s.id ? "var(--teal)" : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl p-4"
          style={{
            background: current.bg,
            border: `1px solid ${current.border}`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 p-1.5 rounded-lg flex-shrink-0"
              style={{ background: current.bg }}
            >
              <Icon size={16} style={{ color: current.iconColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-semibold tracking-wide uppercase mb-1"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: current.labelColor,
                }}
              >
                {current.label}
              </p>
              <p
                className={`text-sm font-semibold leading-snug ${current.strikethrough ? "line-through opacity-70" : ""}`}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "var(--text-prime)",
                }}
              >
                {current.primary}
              </p>
              <p
                className="text-xs mt-0.5 leading-relaxed"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "var(--text-muted)",
                }}
              >
                {current.secondary}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div
        className="w-full h-px rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <motion.div
          key={step}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: DURATION / 1000, ease: "linear" }}
          className="h-full"
          style={{ background: "var(--teal)" }}
        />
      </div>
    </div>
  );
}
