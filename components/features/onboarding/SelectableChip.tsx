"use client";

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function SelectableChip({ label, selected, onToggle, disabled = false }: SelectableChipProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled && !selected}
      className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: selected ? "rgba(0,201,167,0.12)" : "var(--bg-card)",
        border: selected ? "1px solid rgba(0,201,167,0.4)" : "1px solid var(--border)",
        color: selected ? "var(--teal)" : "var(--text-muted)",
        opacity: disabled && !selected ? 0.4 : 1,
        cursor: disabled && !selected ? "not-allowed" : "pointer",
      }}
    >
      {label}
    </button>
  );
}
