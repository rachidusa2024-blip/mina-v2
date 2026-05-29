"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const t = {
  en: {
    headline: "Create your account.",
    sub: "Your Mina plan is ready. Save it by creating a free account.",
    google: "Continue with Google",
    or: "or continue with email",
    firstName: "First name", lastName: "Last name",
    email: "Email address", state: "State", city: "City",
    password: "Password", confirmPassword: "Confirm password",
    terms: "I agree to the", termsLink: "Terms of Service",
    and: "and", privacyLink: "Privacy Policy",
    submit: "Create Free Account", submitting: "Creating account...",
    signinPrompt: "Already have an account?", signinLink: "Sign in",
    googleSoon: "Google sign-in coming soon. Use email for now.",
    errors: {
      required: "Required.", emailInvalid: "Invalid email.",
      passwordShort: "Min. 8 characters.", passwordMismatch: "Passwords do not match.",
      termsRequired: "You must agree to the terms.", general: "Something went wrong. Please try again.",
    },
  },
  es: {
    headline: "Crea tu cuenta.", sub: "Tu plan Mina está listo.",
    google: "Continuar con Google", or: "o continuar con email",
    firstName: "Nombre", lastName: "Apellido",
    email: "Correo electrónico", state: "Estado", city: "Ciudad",
    password: "Contraseña", confirmPassword: "Confirmar contraseña",
    terms: "Acepto los", termsLink: "Términos", and: "y la", privacyLink: "Privacidad",
    submit: "Crear Cuenta Gratis", submitting: "Creando cuenta...",
    signinPrompt: "¿Ya tienes una cuenta?", signinLink: "Iniciar sesión",
    googleSoon: "Google próximamente. Usa email por ahora.",
    errors: {
      required: "Requerido.", emailInvalid: "Correo inválido.",
      passwordShort: "Mín. 8 caracteres.", passwordMismatch: "No coinciden.",
      termsRequired: "Debes aceptar.", general: "Algo salió mal.",
    },
  },
};

interface FormValues {
  firstName: string; lastName: string; email: string;
  state: string; city: string; password: string;
  confirmPassword: string; terms: boolean;
}
interface FormErrors { [key: string]: string | undefined; }

interface AccountCreationProps {
  lang: "en" | "es";
  onComplete: (email: string) => void;
}

export default function AccountCreation({ lang, onComplete }: AccountCreationProps) {
  const c = t[lang];
  const [values, setValues] = useState<FormValues>({
    firstName: "", lastName: "", email: "", state: "", city: "",
    password: "", confirmPassword: "", terms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleNotice, setGoogleNotice] = useState(false);

  const set = (key: keyof FormValues, value: string | boolean) => {
    setValues(v => ({ ...v, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!values.firstName.trim()) e.firstName = c.errors.required;
    if (!values.lastName.trim()) e.lastName = c.errors.required;
    if (!values.email.trim()) e.email = c.errors.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = c.errors.emailInvalid;
    if (!values.state.trim()) e.state = c.errors.required;
    if (!values.city.trim()) e.city = c.errors.required;
    if (!values.password) e.password = c.errors.required;
    else if (values.password.length < 8) e.password = c.errors.passwordShort;
    if (values.password !== values.confirmPassword) e.confirmPassword = c.errors.passwordMismatch;
    if (!values.terms) e.terms = c.errors.termsRequired;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      // Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
          },
        },
      });

      if (signUpError) {
        setErrors({ general: signUpError.message });
        setLoading(false);
        return;
      }

      // Upsert profile row
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          state: values.state,
          city: values.city,
          preferred_language: lang,
          onboarding_completed: true,
        });

        // Save onboarding answers
        const onboardingRaw = sessionStorage.getItem("mina_onboarding_v2");
        if (onboardingRaw) {
          const onboarding = JSON.parse(onboardingRaw);
          await supabase.from("onboarding_responses").insert({
            user_id: data.user.id,
            pressure_sources: onboarding.pressureSources ?? [],
            hardest_parts: onboarding.hardestThings ?? [],
            urgency_level: onboarding.urgencyLevel ?? 3,
            fears: onboarding.fears ?? [],
            pressure_behavior: onboarding.behaviorPatterns ?? [],
            support_style: onboarding.supportStyle ?? [],
          });
        }
      }

      onComplete(values.email);
    } catch {
      setErrors({ general: c.errors.general });
    }
    setLoading(false);
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    fontFamily: "'DM Sans', sans-serif",
    background: "var(--bg-card)",
    border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "var(--border)"}`,
    color: "var(--text-prime)",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    width: "100%",
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box",
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--text-muted)",
    marginBottom: "0.375rem",
    display: "block",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }} className="flex flex-col gap-7">

      <div className="flex flex-col gap-2">
        <h2 className="leading-tight tracking-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 5vw, 2.4rem)", color: "var(--text-prime)" }}>
          {c.headline}
        </h2>
        <p className="text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
          {c.sub}
        </p>
      </div>

      {/* Google */}
      <div className="flex flex-col gap-2">
        <button onClick={() => setGoogleNotice(true)}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text-prime)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {c.google}
        </button>
        {googleNotice && (
          <p className="text-xs text-center" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(245,158,11,0.8)" }}>
            {c.googleSoon}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.5)" }}>{c.or}</span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      {errors.general && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <AlertCircle size={14} style={{ color: "#ef4444", flexShrink: 0 }} />
          <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "#ef4444" }}>{errors.general}</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={labelStyle}>{c.firstName}</label>
            <input type="text" value={values.firstName} onChange={e => set("firstName", e.target.value)}
              style={inputStyle(!!errors.firstName)} placeholder="John" />
            {errors.firstName && <p className="text-xs mt-1" style={{ color: "#ef4444", fontFamily: "'DM Sans', sans-serif" }}>{errors.firstName}</p>}
          </div>
          <div>
            <label style={labelStyle}>{c.lastName}</label>
            <input type="text" value={values.lastName} onChange={e => set("lastName", e.target.value)}
              style={inputStyle(!!errors.lastName)} placeholder="Doe" />
            {errors.lastName && <p className="text-xs mt-1" style={{ color: "#ef4444", fontFamily: "'DM Sans', sans-serif" }}>{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label style={labelStyle}>{c.email}</label>
          <input type="email" value={values.email} onChange={e => set("email", e.target.value)}
            style={inputStyle(!!errors.email)} placeholder="you@email.com" />
          {errors.email && <p className="text-xs mt-1" style={{ color: "#ef4444", fontFamily: "'DM Sans', sans-serif" }}>{errors.email}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={labelStyle}>{c.state}</label>
            <input type="text" value={values.state} onChange={e => set("state", e.target.value)}
              style={inputStyle(!!errors.state)} placeholder="NJ" />
          </div>
          <div>
            <label style={labelStyle}>{c.city}</label>
            <input type="text" value={values.city} onChange={e => set("city", e.target.value)}
              style={inputStyle(!!errors.city)} placeholder="Newark" />
          </div>
        </div>

        <div>
          <label style={labelStyle}>{c.password}</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={values.password}
              onChange={e => set("password", e.target.value)}
              style={{ ...inputStyle(!!errors.password), paddingRight: "3rem" }} placeholder="Min. 8 characters" />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs mt-1" style={{ color: "#ef4444", fontFamily: "'DM Sans', sans-serif" }}>{errors.password}</p>}
        </div>

        <div>
          <label style={labelStyle}>{c.confirmPassword}</label>
          <div className="relative">
            <input type={showConfirm ? "text" : "password"} value={values.confirmPassword}
              onChange={e => set("confirmPassword", e.target.value)}
              style={{ ...inputStyle(!!errors.confirmPassword), paddingRight: "3rem" }} placeholder="Repeat password" />
            <button type="button" onClick={() => setShowConfirm(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: "#ef4444", fontFamily: "'DM Sans', sans-serif" }}>{errors.confirmPassword}</p>}
        </div>

        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={values.terms} onChange={e => set("terms", e.target.checked)}
              className="mt-0.5 flex-shrink-0" style={{ accentColor: "var(--teal)", width: "16px", height: "16px" }} />
            <span className="text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
              {c.terms}{" "}
              <Link href="/terms" className="underline" style={{ color: "var(--teal)" }}>{c.termsLink}</Link>
              {" "}{c.and}{" "}
              <Link href="/privacy" className="underline" style={{ color: "var(--teal)" }}>{c.privacyLink}</Link>
            </span>
          </label>
          {errors.terms && <p className="text-xs mt-1" style={{ color: "#ef4444", fontFamily: "'DM Sans', sans-serif" }}>{errors.terms}</p>}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all"
        style={{ fontFamily: "'DM Sans', sans-serif", background: loading ? "rgba(0,201,167,0.6)" : "var(--teal)", color: "#090D1A", cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? <><Loader2 size={15} className="animate-spin" />{c.submitting}</> : c.submit}
      </button>

      <p className="text-sm text-center" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
        {c.signinPrompt}{" "}
        <Link href="/signin" className="font-semibold" style={{ color: "var(--teal)" }}>{c.signinLink}</Link>
      </p>
    </motion.div>
  );
}
