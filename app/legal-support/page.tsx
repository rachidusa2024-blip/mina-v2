"use client";

import { ArrowLeft, Scale, ExternalLink, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const RESOURCES = [
  { category: "Free legal help", color: "#818CF8", items: [
    { name: "Legal Aid Society", desc: "Free legal representation for qualifying individuals in civil matters.", url: "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help" },
    { name: "CFPB — Consumer Finance", desc: "File complaints, understand your rights, and access free educational resources.", url: "https://www.consumerfinance.gov" },
    { name: "NFCC — Credit Counseling", desc: "Nonprofit credit counseling and debt management plan assistance.", url: "https://www.nfcc.org" },
  ]},
  { category: "When you need an attorney", color: "#C9A84C", items: [
    { name: "NACA — Find a Consumer Attorney", desc: "National Association of Consumer Advocates. Many take FDCPA cases on contingency — you pay nothing.", url: "https://www.consumeradvocates.org/find-an-attorney" },
    { name: "Your State Bar Association", desc: "Find licensed attorneys in your state. Most offer free initial consultations.", url: "https://www.americanbar.org/groups/legal_services/flh-home" },
  ]},
];

const RIGHTS = [
  "Collectors must send written verification of the debt within 5 days of first contact.",
  "You have 30 days to dispute a debt in writing after receiving the first notice.",
  "Collectors cannot call before 8am or after 9pm in your time zone.",
  "You can request in writing that they stop contacting you — they must comply.",
  "Collectors cannot threaten legal action they do not intend to take.",
  "Medical debt and IRS debt have specific rules separate from standard debt collection.",
];

export default function LegalSupportPage() {
  const saveReviewed = async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("timeline_events").insert({
        user_id: user.id, event_type: "Other", title: "Reviewed legal support resources",
        description: "Viewed legal aid resources and consumer rights in Mina.", source_feature: "legal_support",
      });
    } catch {}
  };

  return (
    <div style={{ background: "#090D1A", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "24px 16px" }}>
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#8892A4", fontSize: "14px", textDecoration: "none", marginBottom: "32px" }}>
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div style={{ marginBottom: "32px" }}>
          <p style={{ color: "#f97316", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "8px" }}>Legal Support</p>
          <h1 style={{ color: "#F0F4FF", fontSize: "clamp(1.5rem, 5vw, 2rem)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2, marginBottom: "12px" }}>Know Your Options</h1>
          <p style={{ color: "#8892A4", fontSize: "14px", lineHeight: 1.6 }}>Mina does not provide legal advice. These are real resources — many of which cost you nothing.</p>
        </div>

        {/* Consumer rights */}
        <div style={{ padding: "20px 24px", borderRadius: "16px", background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.15)", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <BookOpen size={16} style={{ color: "#818CF8" }} />
            <p style={{ color: "#818CF8", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Your rights under FDCPA</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {RIGHTS.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: "12px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#818CF8", flexShrink: 0, marginTop: "6px" }} />
                <p style={{ color: "#F0F4FF", fontSize: "14px", lineHeight: 1.6 }}>{r}</p>
              </div>
            ))}
          </div>
        </div>

        {RESOURCES.map(section => (
          <div key={section.category} style={{ marginBottom: "32px" }}>
            <p style={{ color: section.color, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "16px" }}>{section.category}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {section.items.map(item => (
                <motion.a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" onClick={saveReviewed}
                  whileHover={{ scale: 1.005 }}
                  style={{ padding: "16px 20px", borderRadius: "14px", background: "#111827", border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none", display: "block" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                    <div>
                      <p style={{ color: "#F0F4FF", fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>{item.name}</p>
                      <p style={{ color: "#8892A4", fontSize: "13px", lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                    <ExternalLink size={14} style={{ color: "#8892A4", flexShrink: 0, marginTop: "2px" }} />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        ))}

        <div style={{ padding: "16px 20px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ color: "#8892A4", fontSize: "13px", lineHeight: 1.6 }}>
            <strong style={{ color: "#F0F4FF" }}>Mina does not replace attorneys</strong> and does not provide legal representation. Mina will never use fear to pressure you into unnecessary legal action.
          </p>
        </div>
      </div>
    </div>
  );
}
