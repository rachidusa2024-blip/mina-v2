"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface PricingCardProps {
  tier: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  highlighted?: boolean;
  accentColor: string;
  accentDim: string;
  index: number;
  onCta: () => void;
  isFree?: boolean;
}

export default function PricingCard({
  tier,
  price,
  period,
  description,
  features,
  ctaLabel,
  highlighted = false,
  accentColor,
  accentDim,
  index,
  onCta,
  isFree = false,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="relative flex flex-col gap-6 p-6 rounded-2xl"
      style={{
        background: highlighted ? "rgba(0,201,167,0.06)" : "var(--bg-card)",
        border: highlighted
          ? "1px solid rgba(0,201,167,0.35)"
          : "1px solid var(--border)",
        boxShadow: highlighted ? "0 0 40px rgba(0,201,167,0.08)" : "none",
      }}
    >
      {/* Popular badge */}
      {highlighted && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: "var(--teal)",
            color: "#090D1A",
            whiteSpace: "nowrap",
          }}
        >
          Most Popular
        </div>
      )}

      {/* Tier name */}
      <div className="flex flex-col gap-1">
        <span
          className="text-xs font-bold tracking-[0.15em] uppercase"
          style={{ fontFamily: "'DM Sans', sans-serif", color: accentColor }}
        >
          {tier}
        </span>

        {/* Price */}
        <div className="flex items-baseline gap-1 mt-1">
          <span
            className="text-4xl font-bold"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}
          >
            {price}
          </span>
          {period && (
            <span
              className="text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
            >
              {period}
            </span>
          )}
        </div>

        <p
          className="text-sm mt-1 leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
        >
          {description}
        </p>
      </div>

      {/* Divider */}
      <div
        className="h-px w-full"
        style={{ background: `linear-gradient(to right, ${accentColor}25, transparent)` }}
      />

      {/* Features */}
      <ul className="flex flex-col gap-2.5 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check
              size={14}
              className="mt-0.5 flex-shrink-0"
              style={{ color: accentColor }}
            />
            <span
              className="text-sm leading-snug"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onCta}
        className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: highlighted ? "var(--teal)" : accentDim,
          color: highlighted ? "#090D1A" : accentColor,
          border: highlighted ? "none" : `1px solid ${accentColor}30`,
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          if (highlighted) {
            el.style.background = "#00ddb8";
          } else {
            el.style.background = `${accentColor}22`;
          }
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = highlighted ? "var(--teal)" : accentDim;
        }}
      >
        {ctaLabel}
      </button>
    </motion.div>
  );
}
