"use client";

import Link from "next/link";
import { LogOut, Bell } from "lucide-react";

interface DashboardHeaderProps {
  firstName?: string;
}

export default function DashboardHeader({ firstName = "there" }: DashboardHeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-30"
      style={{
        background: "rgba(9,13,26,0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: "var(--teal)", color: "#090D1A" }}
          >
            S
          </div>
          <span
            className="text-sm font-semibold hidden sm:block"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}
          >
            Sum Goals
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-3">
          <span
            className="text-sm hidden sm:block"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
          >
            Hi, {firstName}
          </span>

          <button
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
            aria-label="Notifications"
          >
            <Bell size={17} />
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
            onClick={() => {/* Supabase signOut wired in Step 4 */}}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
