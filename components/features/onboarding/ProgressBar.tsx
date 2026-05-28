"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0–1
  currentSlide: number;
  totalSlides: number;
}

export default function ProgressBar({ progress, currentSlide, totalSlides }: ProgressBarProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* Track */}
      <div
        className="w-full h-0.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.07)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--teal)" }}
          initial={false}
          animate={{ width: `${Math.max(4, progress * 100)}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        />
      </div>

      {/* Step label */}
      <p
        className="text-xs"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color: "rgba(136,146,164,0.5)",
        }}
      >
        {currentSlide + 1} of {totalSlides}
      </p>
    </div>
  );
}
