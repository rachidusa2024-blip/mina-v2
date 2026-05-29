"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LiveCallPage() {
  return (
    <div style={{
      background: "#090D1A", minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ maxWidth: "400px", width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
        <Link href="/dashboard"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#8892A4", fontSize: "14px", textDecoration: "none" }}>
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
        <div>
          <p style={{ color: "#00C9A7", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "8px" }}>
            Coming soon
          </p>
          <h1 style={{ color: "#F0F4FF", fontSize: "clamp(1.5rem, 5vw, 2rem)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2, marginBottom: "8px" }}>
            Live Call Assistant
          </h1>
          <p style={{ color: "#8892A4", fontSize: "14px", lineHeight: 1.6 }}>
            Start a call session. This workspace is being built now.
          </p>
        </div>
        <Link href="/dashboard"
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "12px 24px", borderRadius: "12px", background: "#00C9A7", color: "#090D1A",
            fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
