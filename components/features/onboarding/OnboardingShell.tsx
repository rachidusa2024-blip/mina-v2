"use client";

import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import ProgressBar from "./ProgressBar";
import { TOTAL_SLIDES } from "./types";
import Link from "next/link";

interface OnboardingShellProps {
  currentSlide: number;
  progress: number;
  isFirstSlide: boolean;
  isAccountSlide: boolean;
  onBack: () => void;
  children: React.ReactNode;
}

export default function OnboardingShell({
  currentSlide,
  progress,
  isFirstSlide,
  isAccountSlide,
  onBack,
  children,
}: OnboardingShellProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-20 px-4 sm:px-6 py-4"
        style={{
          background: "rgba(9,13,26,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-4">
          {/* Back button */}
          <div className="w-8 flex-shrink-0">
            {!isFirstSlide && !isAccountSlide && (
              <button
                onClick={onBack}
                className="p-1.5 rounded-lg transition-colors flex items-center justify-center"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-prime)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
                aria-label="Go back"
              >
                <ChevronLeft size={20} />
              </button>
            )}
          </div>

          {/* Progress bar — hide on account slide */}
          <div className="flex-1">
            {!isAccountSlide && (
              <ProgressBar
                progress={progress}
                currentSlide={currentSlide}
                totalSlides={TOTAL_SLIDES}
              />
            )}
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-1.5"
            aria-label="Sum Goals home"
          >
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
              style={{ background: "var(--teal)", color: "#090D1A" }}
            >
              S
            </div>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-start pt-24 pb-12 px-4 sm:px-6">
        <div className="w-full max-w-lg">
          {children}
        </div>
      </main>
    </div>
  );
}
