"use client";

import { useState } from "react";
import Header from "@/components/features/landing/Header/Header";
import Hero from "@/components/features/landing/Hero/Hero";
import TrustBar from "@/components/features/landing/TrustBar/TrustBar";
import PressureSection from "@/components/features/landing/PressureSection/PressureSection";
import MinaSystemSection from "@/components/features/landing/MinaSystemSection/MinaSystemSection";
import LiveCallSection from "@/components/features/landing/LiveCallSection/LiveCallSection";
import LegalSupportSection from "@/components/features/landing/LegalSupportSection/LegalSupportSection";
import SupportChatWidget from "@/components/features/landing/SupportChatWidget/SupportChatWidget";
import Footer from "@/components/features/landing/Footer/Footer";

export default function LandingPage() {
  const [lang, setLang] = useState<"en" | "es">("en");

  return (
    <div
      style={{
        background: "var(--bg-base)",
        minHeight: "100vh",
        // Design tokens applied globally via CSS variables
        // These can also live in globals.css
        // @ts-ignore
        "--bg-base": "#090D1A",
        "--bg-card": "#111827",
        "--text-prime": "#F0F4FF",
        "--text-muted": "#8892A4",
        "--teal": "#00C9A7",
        "--teal-dim": "rgba(0,201,167,0.1)",
        "--gold": "#C9A84C",
        "--border": "rgba(255,255,255,0.08)",
      } as React.CSSProperties}
    >
      <Header lang={lang} onToggleLang={setLang} />
      <Hero lang={lang} />
      <TrustBar lang={lang} />
      <PressureSection lang={lang} />
      <MinaSystemSection lang={lang} />
      <LiveCallSection lang={lang} />
      <LegalSupportSection lang={lang} />
      <SupportChatWidget lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}

