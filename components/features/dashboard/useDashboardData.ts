"use client";

import { useMemo } from "react";
import { OnboardingData, initialOnboardingData } from "@/components/features/onboarding/types";

export type PressureState = "Calm" | "Rising" | "High" | "Crisis";
export type CurrentPhase = "Stabilize" | "Protect" | "Act" | "Recover";
export type EmotionalState = "Overwhelmed" | "Uncertain" | "Defensive" | "Preparing" | "Focused" | "Recovering";

export interface PrimaryAction {
  label: string;
  route: string;
  timeRequired: string;
  impact: "High" | "Medium" | "Low";
}

export interface MemoryCard {
  label: string; value: string; coachingNote: string;
}

export interface DashboardData {
  firstName: string;
  pressureState: PressureState; pressureStateColor: string;
  currentPhase: CurrentPhase;
  // Hero
  heroLines: string[];       // 2-3 sentences coaching narrative
  heroClosing: string;       // bridge to action
  primaryAction: PrimaryAction;
  // Why This Matters
  whyThisMattersTitle: string;
  whyThisMattersItems: string[];
  // Memory
  memoryCards: MemoryCard[];
  // Journey
  journeyPhases: string[]; currentJourneyIndex: number;
  journeyProgress: number; nextMilestoneName: string;
}

function load(): OnboardingData {
  if (typeof window === "undefined") return initialOnboardingData;
  try {
    const raw = sessionStorage.getItem("mina_onboarding_v2");
    if (raw) return { ...initialOnboardingData, ...JSON.parse(raw) };
  } catch {}
  return initialOnboardingData;
}

const STATE_COLOR: Record<PressureState, string> = {
  Calm: "#22c55e", Rising: "#f59e0b", High: "#f97316", Crisis: "#ef4444",
};

function derivePhase(d: OnboardingData): CurrentPhase {
  const hasLegal = d.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  if (d.urgencyLevel >= 4 || d.hardestThings.some(h => h.toLowerCase().includes("overwhelm"))) return "Stabilize";
  if (hasLegal || d.fears.includes("Being sued") || d.fears.includes("Wage garnishment")) return "Protect";
  return "Stabilize";
}

// Hero narrative: 2-3 sentences that name the situation, acknowledge the pattern, bridge to action
function deriveHeroNarrative(d: OnboardingData): { lines: string[]; closing: string } {
  const avoider = d.behaviorPatterns.some(b => b.toLowerCase().includes("avoid") || b.toLowerCase().includes("ignore"));
  const panicker = d.behaviorPatterns.some(b => b.toLowerCase().includes("panic") || b.toLowerCase().includes("agree"));
  const hasLegal = d.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const hasCollectors = d.pressureSources.some(s => s.toLowerCase().includes("collector"));
  const highUrgency = d.urgencyLevel >= 4;
  const multi = d.pressureSources.length > 1;

  if (hasLegal) return {
    lines: [
      "Legal notices are designed to feel final.",
      "Most people freeze when they receive one — which is exactly what the sender is counting on.",
    ],
    closing: "The fastest way to reduce that pressure is to understand exactly what the document is actually asking for.",
  };

  if (hasCollectors && avoider) return {
    lines: [
      "The pressure from collector calls creates a specific kind of stress.",
      "When that stress rises, stepping back can feel like the safest response — but it tends to leave the situation exactly where it was.",
    ],
    closing: "The most effective thing right now is to have your response ready before the next call happens.",
  };

  if (hasCollectors && panicker) return {
    lines: [
      "Collector calls are scripted to produce agreements before you have had time to think.",
      "The urgency is manufactured — but it works, because there is no plan ready when the phone rings.",
    ],
    closing: "Having your response prepared in advance is the only thing that changes the outcome of that call.",
  };

  if (highUrgency) return {
    lines: [
      "When everything feels urgent at once, nothing moves.",
      "The pressure is real — but it is distorting which things are actually time-sensitive and which are not.",
    ],
    closing: "Slowing down for three minutes is not avoidance. It is the only way to choose the right next move.",
  };

  if (multi) return {
    lines: [
      "Carrying multiple debt sources at once makes it hard to know where to start.",
      "That difficulty is not a failure of motivation — it is what happens when pressure has no clear entry point.",
    ],
    closing: "The fastest path forward is to give Mina the most stressful document you have received. That is where the real picture begins.",
  };

  return {
    lines: [
      "Financial pressure is not just about money.",
      "It is about the weight of decisions that feel more dangerous than they are, made without enough information.",
    ],
    closing: "The fastest way to reduce that weight is to replace uncertainty with specific facts about where you actually stand.",
  };
}

// Primary action: the single most important thing to do
function derivePrimaryAction(d: OnboardingData): PrimaryAction {
  const hasLegal = d.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const hasCollectors = d.pressureSources.some(s => s.toLowerCase().includes("collector"));
  if (hasLegal) return { label: "Upload Legal Document", route: "/documents", timeRequired: "3 minutes", impact: "High" };
  if (hasCollectors) return { label: "Prepare for a Collector Call", route: "/live-call", timeRequired: "5 minutes", impact: "High" };
  if (d.urgencyLevel >= 4) return { label: "Start Stabilize Mode", route: "/stabilize", timeRequired: "3 minutes", impact: "High" };
  return { label: "Upload the Most Stressful Letter", route: "/documents", timeRequired: "3 minutes", impact: "Medium" };
}

// Why This Matters: specific benefits tied to the action — not generic
function deriveWhyThisMatters(d: OnboardingData): { title: string; items: string[] } {
  const hasLegal = d.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const hasCollectors = d.pressureSources.some(s => s.toLowerCase().includes("collector"));

  if (hasLegal) return {
    title: "By reviewing your legal document, Mina can:",
    items: [
      "Identify the actual deadline — and whether it has passed",
      "Explain what the sender is legally entitled to ask for",
      "Flag any pressure tactics or misrepresentations",
      "Show which parts require a response and which do not",
      "Outline your rights under FDCPA and FCRA",
      "Tell you whether you need an attorney — and where to find one",
    ],
  };

  if (hasCollectors) return {
    title: "By preparing before the call, you will:",
    items: [
      "Have exact phrases ready before the phone rings",
      "Know how to pause the conversation without escalating it",
      "Recognize urgency tactics before they work",
      "Understand what you are and are not required to say",
      "Keep a record of what was said in case it matters later",
      "Feel in control of a situation designed to take control from you",
    ],
  };

  if (d.urgencyLevel >= 4) return {
    title: "By opening Stabilize Mode, Mina will help you:",
    items: [
      "Identify what is actually urgent versus what only feels urgent",
      "Separate real risk from pressure-amplified fear",
      "Name the single most important thing to address first",
      "Reduce the cognitive load of carrying multiple pressures at once",
      "Create one clear next step so the paralysis lifts",
    ],
  };

  return {
    title: "By reviewing your document, Mina can:",
    items: [
      "Identify any deadlines — including ones you may have missed",
      "Highlight pressure tactics used by the sender",
      "Explain what the sender is actually asking for",
      "Show your response options clearly",
      "Tell you what can wait and what cannot",
      "Help you respond from a position of understanding, not fear",
    ],
  };
}

function deriveMemoryCards(d: OnboardingData, main: string, fear: string, style: string, phase: CurrentPhase): MemoryCard[] {
  const avoider = d.behaviorPatterns.some(b => b.toLowerCase().includes("avoid") || b.toLowerCase().includes("ignore"));
  const multi = d.pressureSources.length > 1;
  return [
    { label: "What you're carrying", value: multi ? `${d.pressureSources.length} sources of pressure` : main,
      coachingNote: multi ? "Multiple sources tracked across your answers." : "This shapes where Mina focuses first." },
    { label: "What worries you most", value: fear,
      coachingNote: avoider ? "Mina works around this in every recommendation." : "This appears across multiple answers — Mina has noted it." },
    { label: "How you prefer support", value: style,
      coachingNote: "This shapes the tone and structure of every response." },
    { label: "Where you are now", value: phase,
      coachingNote: "Updates as you complete sessions and take action." },
  ];
}

const NEXT_MILESTONES: Record<string, string> = {
  Stabilize: "Understand what is creating the most pressure",
  Understand: "Identify your position and protect it",
  Protect: "Take deliberate action on priority items",
  Act: "Resolve the active situations",
  Resolve: "Begin rebuilding your foundation",
  Recover: "Maintain the control you have built",
};

export function useDashboardData(): DashboardData {
  const raw = useMemo(() => load(), []);
  return useMemo(() => {
    const pressureState = (raw.urgencyLevel <= 1 ? "Calm" : raw.urgencyLevel <= 2 ? "Rising" : raw.urgencyLevel <= 3 ? "High" : "Crisis") as PressureState;
    const phase = derivePhase(raw);
    const hero = deriveHeroNarrative(raw);
    const action = derivePrimaryAction(raw);
    const why = deriveWhyThisMatters(raw);
    const journeyPhases = ["Stabilize", "Understand", "Protect", "Act", "Resolve", "Recover"];
    const currentJourneyIndex = Math.max(0, journeyPhases.indexOf(phase));
    const mainPressure = raw.pressureSources.length > 0
      ? (raw.pressureSources.length === 1 ? raw.pressureSources[0] : `${raw.pressureSources.length} debt sources`)
      : "General financial pressure";
    const fearPattern = raw.fears.length > 0 ? raw.fears[0] : "Managing uncertainty";
    const supportStyle = raw.supportStyle[0] ?? "Step-by-step guidance";
    return {
      firstName: "there",
      pressureState, pressureStateColor: STATE_COLOR[pressureState], currentPhase: phase,
      heroLines: hero.lines, heroClosing: hero.closing,
      primaryAction: action,
      whyThisMattersTitle: why.title,
      whyThisMattersItems: why.items,
      memoryCards: deriveMemoryCards(raw, mainPressure, fearPattern, supportStyle, phase),
      journeyPhases, currentJourneyIndex,
      journeyProgress: Math.round((currentJourneyIndex / (journeyPhases.length - 1)) * 100),
      nextMilestoneName: NEXT_MILESTONES[journeyPhases[currentJourneyIndex]] ?? "",
    };
  }, [raw]);
}
