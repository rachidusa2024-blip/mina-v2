"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Upload, FileText, Plus, Clock, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface DocRecord { id: string; file_name: string; document_type: string; analysis_status: string; mina_summary: string | null; created_at: string; }

async function loadDocs(): Promise<DocRecord[]> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase.from("document_records").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    return data ?? [];
  } catch { return []; }
}

async function saveDoc(name: string, type: string): Promise<DocRecord | null> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("document_records").insert({ user_id: user.id, file_name: name, document_type: type, analysis_status: "pending" }).select().single();
    return data;
  } catch { return null; }
}

const DOC_TYPES = ["Collection letter", "Court summons / lawsuit", "Medical bill", "IRS notice", "Credit report", "Other"];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("Collection letter");
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadDocs().then(setDocs); }, []);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const saved = await saveDoc(name.trim(), type);
    if (saved) setDocs(prev => [saved, ...prev]);
    setName(""); setType("Collection letter"); setShowForm(false); setSaving(false);
  };

  const statusColor = (s: string) => s === "complete" ? "#22c55e" : s === "analyzing" ? "#f59e0b" : "#8892A4";
  const statusIcon = (s: string) => s === "complete" ? CheckCircle : s === "analyzing" ? Loader2 : Clock;

  return (
    <div style={{ background: "#090D1A", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "24px 16px" }}>

        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#8892A4", fontSize: "14px", textDecoration: "none", marginBottom: "32px" }}>
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <p style={{ color: "#00C9A7", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "8px" }}>Documents</p>
            <h1 style={{ color: "#F0F4FF", fontSize: "clamp(1.5rem, 5vw, 2rem)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>Understand What They Sent You</h1>
          </div>
          <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "10px", background: "#00C9A7", border: "none", color: "#090D1A", fontSize: "13px", fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
            <Plus size={14} /> Add
          </button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: "20px", borderRadius: "16px", background: "#111827", border: "1px solid rgba(0,201,167,0.2)", marginBottom: "24px" }}>
            <p style={{ color: "#00C9A7", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "16px" }}>Add Document</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Document name (e.g. Letter from Midland Credit)"
                style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#F0F4FF", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
              <select value={type} onChange={e => setType(e.target.value)}
                style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#F0F4FF", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
                {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleAdd} disabled={!name.trim() || saving}
                  style={{ flex: 1, padding: "10px", borderRadius: "10px", background: name.trim() && !saving ? "#00C9A7" : "rgba(255,255,255,0.06)", border: "none", color: name.trim() && !saving ? "#090D1A" : "#8892A4", fontSize: "14px", fontWeight: 700, cursor: name.trim() && !saving ? "pointer" : "not-allowed" }}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setShowForm(false)}
                  style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#8892A4", fontSize: "14px", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {docs.length === 0 && !showForm ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(0,201,167,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <FileText size={24} style={{ color: "#00C9A7" }} />
            </div>
            <p style={{ color: "#F0F4FF", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>No documents yet</p>
            <p style={{ color: "#8892A4", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>Add the most stressful letter or notice you have received. Mina will analyze it and explain what it actually means.</p>
            <button onClick={() => setShowForm(true)} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "12px", background: "#00C9A7", border: "none", color: "#090D1A", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
              <Upload size={15} /> Add first document
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {docs.map(doc => {
              const StatusIcon = statusIcon(doc.analysis_status);
              return (
                <motion.div key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ padding: "16px 20px", borderRadius: "14px", background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                    <div>
                      <p style={{ color: "#F0F4FF", fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>{doc.file_name}</p>
                      <p style={{ color: "#8892A4", fontSize: "12px" }}>{doc.document_type}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                      <StatusIcon size={13} style={{ color: statusColor(doc.analysis_status) }} />
                      <span style={{ color: statusColor(doc.analysis_status), fontSize: "12px", fontWeight: 600 }}>{doc.analysis_status}</span>
                    </div>
                  </div>
                  {doc.mina_summary && <p style={{ color: "#8892A4", fontSize: "13px", lineHeight: 1.6, marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>{doc.mina_summary}</p>}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
