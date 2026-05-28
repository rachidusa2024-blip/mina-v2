import { OnboardingData } from "../types";

export interface MinaSummary {
  pressure: string;
  patterns: string;
  focus: string;
  recommendation: string;
}

const urgencyFocus: Record<number, { en: string; es: string }> = {
  1: {
    en: "We'll help you stay ahead of the pressure before it escalates.",
    es: "Te ayudaremos a mantenerte por delante de la presión antes de que escale.",
  },
  2: {
    en: "We'll help you get clarity on what actually needs attention first.",
    es: "Te ayudaremos a aclarar qué necesita atención primero.",
  },
  3: {
    en: "We'll break this down into manageable steps, one at a time.",
    es: "Dividiremos esto en pasos manejables, uno a la vez.",
  },
  4: {
    en: "We'll help you slow down decisions and protect your position carefully.",
    es: "Te ayudaremos a tomar decisiones más lentas y proteger tu posición con cuidado.",
  },
  5: {
    en: "We'll focus on slowing things down and helping you regain clarity first.",
    es: "Nos enfocaremos en desacelerar y ayudarte a recuperar la claridad primero.",
  },
};

const behaviorSummary: Record<string, { en: string; es: string }> = {
  "I avoid everything": { en: "avoiding situations when pressure rises", es: "evitar situaciones cuando aumenta la presión" },
  "I answer too quickly": { en: "responding before fully understanding the situation", es: "responder antes de entender completamente la situación" },
  "I panic and agree": { en: "agreeing to things under emotional pressure", es: "acordar cosas bajo presión emocional" },
  "I shut down emotionally": { en: "shutting down when overwhelmed", es: "cerrarse emocionalmente cuando se siente abrumado" },
  "I overthink everything": { en: "overthinking decisions under stress", es: "pensar demasiado en las decisiones bajo estrés" },
  "I try to solve everything at once": { en: "trying to solve everything at once", es: "tratar de resolver todo a la vez" },
  "I ignore calls and messages": { en: "avoiding calls and messages", es: "ignorar llamadas y mensajes" },
  "I become anxious after conversations": { en: "feeling anxious after difficult conversations", es: "sentirse ansioso después de conversaciones difíciles" },
};

const recommendationMap: Record<string, { en: string; es: string }> = {
  high_urgency: {
    en: "Start with Stabilize Mode to slow down the pressure — then upload the most stressful document you have received.",
    es: "Comienza con el Modo Estabilización para reducir la presión — luego sube el documento más estresante que hayas recibido.",
  },
  legal: {
    en: "Upload any legal notices or summons first so Mina can analyze them and help you understand your options.",
    es: "Sube primero cualquier aviso legal o citación para que Mina pueda analizarlo y ayudarte a entender tus opciones.",
  },
  calls: {
    en: "Open a Live Call session before your next collector call so Mina is ready beside you.",
    es: "Abre una sesión de Llamada en Vivo antes de tu próxima llamada de cobrador para que Mina esté lista a tu lado.",
  },
  default: {
    en: "Start with Stabilize Mode and upload the most stressful letter or notice you have received.",
    es: "Comienza con el Modo Estabilización y sube la carta o aviso más estresante que hayas recibido.",
  },
};

export function generateSummary(data: OnboardingData, lang: "en" | "es" = "en"): MinaSummary {
  const l = lang;

  // --- Pressure ---
  const sourcesLower = data.pressureSources.map((s) => s.toLowerCase());
  let pressure: string;
  if (data.pressureSources.length === 0) {
    pressure = l === "en"
      ? "General financial pressure and uncertainty."
      : "Presión financiera general e incertidumbre.";
  } else if (data.pressureSources.length === 1) {
    pressure = l === "en"
      ? `Primary pressure from ${data.pressureSources[0].toLowerCase()}.`
      : `Presión principal por ${data.pressureSources[0].toLowerCase()}.`;
  } else if (data.pressureSources.length <= 3) {
    const joined = data.pressureSources.slice(0, 3).map((s) => s.toLowerCase()).join(", ");
    pressure = l === "en"
      ? `Pressure from multiple sources: ${joined}.`
      : `Presión de múltiples fuentes: ${joined}.`;
  } else {
    pressure = l === "en"
      ? `Multiple overlapping debt sources — including ${data.pressureSources.slice(0, 2).map((s) => s.toLowerCase()).join(" and ")}.`
      : `Múltiples fuentes de deuda superpuestas — incluidas ${data.pressureSources.slice(0, 2).map((s) => s.toLowerCase()).join(" y ")}.`;
  }

  // --- Patterns ---
  const topBehavior = data.behaviorPatterns[0];
  let patterns: string;
  if (!topBehavior) {
    patterns = l === "en"
      ? "You are building awareness of how pressure affects your decisions."
      : "Estás desarrollando conciencia de cómo la presión afecta tus decisiones.";
  } else {
    const b = behaviorSummary[topBehavior];
    const desc = b ? (l === "en" ? b.en : b.es) : topBehavior.toLowerCase();
    patterns = l === "en"
      ? `You tend toward ${desc} — Mina will help you pause before responding.`
      : `Tiendes hacia ${desc} — Mina te ayudará a pausar antes de responder.`;
  }

  // --- Focus ---
  const level = Math.round(Math.min(5, Math.max(1, data.urgencyLevel)));
  const focusEntry = urgencyFocus[level] || urgencyFocus[3];
  const focus = l === "en" ? focusEntry.en : focusEntry.es;

  // --- Recommendation ---
  const hasLegal = sourcesLower.includes("lawsuit or legal notices");
  const hasCalls = sourcesLower.includes("debt collectors");
  const isHighUrgency = data.urgencyLevel >= 4;

  let recKey: keyof typeof recommendationMap = "default";
  if (isHighUrgency) recKey = "high_urgency";
  else if (hasLegal) recKey = "legal";
  else if (hasCalls) recKey = "calls";

  const rec = recommendationMap[recKey];
  const recommendation = l === "en" ? rec.en : rec.es;

  return { pressure, patterns, focus, recommendation };
}
