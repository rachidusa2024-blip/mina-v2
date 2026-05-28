"use client";

import {
  Phone,
  CreditCard,
  Stethoscope,
  FileWarning,
  Gavel,
  PhoneOff,
  TrendingDown,
  Brain,
} from "lucide-react";
import PressureCard from "./PressureCard";

const items = {
  en: [
    { icon: Phone, label: "Collector calls" },
    { icon: CreditCard, label: "Missed payments" },
    { icon: Stethoscope, label: "Medical debt" },
    { icon: FileWarning, label: "IRS notices" },
    { icon: Gavel, label: "Legal pressure" },
    { icon: PhoneOff, label: "Fear of answering" },
    { icon: TrendingDown, label: "Credit anxiety" },
    { icon: Brain, label: "Overwhelm" },
  ],
  es: [
    { icon: Phone, label: "Llamadas de cobradores" },
    { icon: CreditCard, label: "Pagos perdidos" },
    { icon: Stethoscope, label: "Deuda médica" },
    { icon: FileWarning, label: "Avisos del IRS" },
    { icon: Gavel, label: "Presión legal" },
    { icon: PhoneOff, label: "Miedo a contestar" },
    { icon: TrendingDown, label: "Ansiedad crediticia" },
    { icon: Brain, label: "Agobio" },
  ],
};

interface PressureGridProps {
  lang: "en" | "es";
}

export default function PressureGrid({ lang }: PressureGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items[lang].map((item, i) => (
        <PressureCard
          key={item.label}
          icon={item.icon}
          label={item.label}
          index={i}
        />
      ))}
    </div>
  );
}

