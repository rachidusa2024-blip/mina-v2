"use client";

import type { LucideIcon } from "lucide-react";

interface SelectableCardProps {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  onToggle: () => void;
}

export default function SelectableCard({ icon: Icon, label, selected, onToggle }: SelectableCardProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left transition-all duration-150"
      style={{
        background: selected ? "rgba(0,201,167,0.09)" : "var(--bg-card)",
        border: selected ? "1px solid rgba(0,201,167,0.4)" : "1px solid var(--border)",
        outline: "none",
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150"
        style={{
          background: selected ? "rgba(0,201,167,0.15)" : "rgba(255,255,255,0.05)",
        }}
      >
        <Icon
          size={16}
          style={{ color: selected ? "var(--teal)" : "var(--text-muted)" }}
        />
      </div>
      <span
        className="text-sm font-medium"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color: selected ? "var(--text-prime)" : "var(--text-muted)",
        }}
      >
        {label}
      </span>
      {selected && (
        <div
          className="ml-auto w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--teal)" }}
        >
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3l2 2 4-4" stroke="#090D1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  );
}
