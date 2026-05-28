"use client";

import HeroText from "./HeroText";
import HeroCTAs from "./HeroCTAs";
import PhoneMockup from "./PhoneMockup";

interface HeroProps {
  lang: "en" | "es";
}

export default function Hero({ lang }: HeroProps) {
  return (
    <section
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(0,201,167,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 70%, rgba(129,140,248,0.04) 0%, transparent 60%)
          `,
        }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center py-16 lg:py-24">

          {/* Left: text */}
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <HeroText lang={lang} />
            <HeroCTAs lang={lang} />
          </div>

          {/* Right: phone */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <PhoneMockup />
          </div>

        </div>
      </div>
    </section>
  );
}
