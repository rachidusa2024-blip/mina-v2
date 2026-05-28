"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col gap-3 ${alignClass} ${className}`}
    >
      {eyebrow && (
        <span
          className="text-xs font-semibold tracking-[0.18em] uppercase"
          style={{ color: "var(--teal)" }}
        >
          {eyebrow}
        </span>
      )}

      <h2
        className="text-3xl sm:text-4xl lg:text-5xl leading-[1.12] tracking-tight"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "var(--text-prime)",
        }}
      >
        {title}{" "}
        {titleHighlight && (
          <span style={{ color: "var(--teal)" }}>{titleHighlight}</span>
        )}
      </h2>

      {subtitle && (
        <p
          className="text-base sm:text-lg max-w-2xl leading-relaxed"
          style={{
            color: "var(--text-muted)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
