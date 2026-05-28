"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface CapabilityCardProps {
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
  title: string;
  description: string;
  details: string[];
  cta?: { label: string; href: string };
  disclaimer?: string;
  accentColor: string;
  accentDim: string;
  dimmed?: boolean;
  index: number;
}

export default function CapabilityCard({
  icon: Icon,
  badge,
  badgeColor,
  title,
  description,
  details,
  cta,
  disclaimer,
  accentColor,
  accentDim,
  dimmed = false,
  index,
}: CapabilityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col gap-5 p-7 rounded-2xl"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${accentColor}28`,
        opacity: dimmed ? 0.72 : 1,
      }}
    >
      {/* Badge */}
      {badge && (
        <span
          className="absolute top-5 right-5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: badgeColor ? `${badgeColor}18` : accentDim,
            color: badgeColor || accentColor,
            border: `1px solid ${badgeColor || accentColor}30`,
          }}
        >
          {badge}
        </span>
      )}

      {/* Icon + title */}
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: accentDim }}
        >
          <Icon size={20} style={{ color: accentColor }} />
        </div>
        <div>
          <h3
            className="text-lg font-semibold leading-tight"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--text-prime)",
            }}
          >
            {title}
          </h3>
          <p
            className="text-sm mt-1"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--text-muted)",
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Details */}
      <ul className="flex flex-col gap-2">
        {details.map((d) => (
          <li
            key={d}
            className="flex items-start gap-2.5 text-sm"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--text-muted)",
            }}
          >
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: accentColor, opacity: 0.6 }}
            />
            {d}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {cta && !dimmed && (
        <Link
          href={cta.href}
          className="mt-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 self-start"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: accentDim,
            color: accentColor,
            border: `1px solid ${accentColor}30`,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = `${accentColor}20`;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = accentDim;
          }}
        >
          {cta.label}
        </Link>
      )}

      {/* Disclaimer */}
      {disclaimer && (
        <p
          className="text-xs italic mt-auto"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "rgba(136,146,164,0.55)",
          }}
        >
          {disclaimer}
        </p>
      )}
    </motion.div>
  );
}
