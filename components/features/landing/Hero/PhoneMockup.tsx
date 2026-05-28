"use client";

import { motion } from "framer-motion";
import CallSequence from "./CallSequence";

export default function PhoneMockup() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient glow layers */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(0,201,167,0.12) 0%, transparent 70%)",
          filter: "blur(20px)",
          transform: "scale(1.4)",
        }}
      />

      {/* Floating phone */}
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10"
        style={{ perspective: "1000px" }}
      >
        {/* Phone outer shell */}
        <div
          className="relative rounded-[2.5rem] overflow-hidden"
          style={{
            width: "260px",
            background: "#0a0d17",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: `
              0 0 0 1px rgba(255,255,255,0.04),
              0 40px 80px rgba(0,0,0,0.6),
              0 20px 40px rgba(0,0,0,0.4),
              inset 0 1px 0 rgba(255,255,255,0.08)
            `,
          }}
        >
          {/* Notch */}
          <div className="relative flex justify-center pt-3 pb-2">
            <div
              className="w-24 h-6 rounded-full"
              style={{ background: "#060810" }}
            />
          </div>

          {/* Screen content */}
          <div className="px-4 pb-6">
            {/* Status bar */}
            <div
              className="flex items-center justify-between text-xs mb-4"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[3, 4, 5].map((h) => (
                    <div
                      key={h}
                      className="w-0.5 rounded-sm"
                      style={{
                        height: `${h}px`,
                        background: "rgba(255,255,255,0.4)",
                      }}
                    />
                  ))}
                </div>
                <span>●●</span>
                <span>🔋</span>
              </div>
            </div>

            {/* Mina header */}
            <div
              className="flex items-center gap-2 mb-4 pb-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: "var(--teal)", color: "#090D1A" }}
              >
                M
              </div>
              <div>
                <p
                  className="text-xs font-semibold"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "var(--text-prime)",
                  }}
                >
                  Mina
                </p>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "var(--teal)",
                  }}
                >
                  ● Active
                </p>
              </div>
            </div>

            {/* Sequence */}
            <CallSequence />
          </div>

          {/* Home bar */}
          <div className="flex justify-center pb-3 pt-1">
            <div
              className="w-24 h-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.15)" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

