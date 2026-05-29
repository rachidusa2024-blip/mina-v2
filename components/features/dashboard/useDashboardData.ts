"use client";

import { useMemo } from "react";
import { OnboardingData, initialOnboardingData } from "@/components/features/onboarding/types";

export type PressureState = "Calm" | "Rising" | "High" | "Crisis";
export type CurrentPhase = "Stabilize" | "Protect" | "Act" | "Recover";

export interface PrimaryAction {
  label: string; route: string; timeRequired: string; impact: "High" | "Medium" | "Low";
  whyRecommends: string;
}
export interface MemoryCard { label: string; value: string; coachingNote: string; }

export interface DashboardData {
  firstName: string;
  pressureState: PressureState; pressureStateColor: string; currentPhase: CurrentPhase;
  // Hero — short: observation + insight + closing (teal) + focus
  heroObservation: string;
  heroInsight: string;
  heroClosing: string;
  heroFocus: string;
  primaryAction: PrimaryAction;
  memoryCards: MemoryCard[];
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

// Short hero: Observation + Insight + Closing. Under 5 sentences total.
function deriveHero(d: OnboardingData): { observation: string; insight: string; closing: string; focus: string } {
  const avoider = d.behaviorPatterns.some(b => b.toLowerCase().includes("avoid") || b.toLowerCase().includes("ignore"));
  const panicker = d.behaviorPatterns.some(b => b.toLowerCase().includes("panic") || b.toLowerCase().includes("agree"));
  const hasLegal = d.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const hasCollectors = d.pressureSources.some(s => s.toLowerCase().includes("collector"));
  const high = d.urgencyLevel >= 4;
  const multi = d.pressureSources.length > 1;

  // Observation: what the situation is (one short sentence)
  const observation = hasLegal ? "You are carrying legal pressure on top of everything else."
    : hasCollectors ? "Collector calls are the main source of pressure right now."
    : high ? "The pressure is high enough that decisions feel dangerous."
    : multi ? "Multiple debt sources are creating pressure at the same time."
    : "The uncertainty here is heavier than the debt itself.";

  // Insight: what pattern Mina sees (one short sentence)
  const insight = avoider ? "When pressure rises, you tend to step back — not from weakness, but to avoid making the wrong move."
    : panicker ? "Under pressure, you tend to respond before you have had time to think it through."
    : "You prefer understanding the full picture before acting.";

  // Closing: what this means for Mina's approach (teal italic, one sentence)
  const closing = hasLegal ? "Mina will help you understand every deadline and every right before you respond to anything."
    : avoider ? "Mina will prepare you before the pressure arrives — so you can respond on your terms."
    : panicker ? "Mina will slow the moment down so the decision stays yours."
    : "Mina will help you replace uncertainty with specific, actionable clarity.";

  const focus = hasLegal ? "Do not respond to anything legal until you understand what it actually requires."
    : hasCollectors ? "Have your response ready before the next call. Not during it."
    : high ? "Identify one thing. Address that. Everything else can wait."
    : "Replace uncertainty with one specific fact about where you stand.";

  return { observation, insight, closing, focus };
}

function derivePrimaryAction(d: OnboardingData): PrimaryAction {
  const hasLegal = d.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const hasCollectors = d.pressureSources.some(s => s.toLowerCase().includes("collector"));
  if (hasLegal) return {
    label: "Upload Legal Document", route: "/documents", timeRequired: "3 minutes", impact: "High",
    whyRecommends: "Legal documents have hard deadlines. Letting one pass — even accidentally — can result in a default judgment. Three minutes now eliminates that risk.",
  };
  if (hasCollectors) return {
    label: "Prepare for a Collector Call", route: "/live-call", timeRequired: "5 minutes", impact: "High",
    whyRecommends: "Collector calls are scripted to produce agreements under stress. The only way to change the outcome is to have your response ready before the call — not during it.",
  };
  if (d.urgencyLevel >= 4) return {
    label: "Start Stabilize Mode", route: "/stabilize", timeRequired: "3 minutes", impact: "High",
    whyRecommends: "High pressure distorts urgency. Stabilize Mode separates real risk from perceived risk so your next action is the right one — not just the one that feels most urgent.",
  };
  return {
    label: "Upload the Most Stressful Letter", route: "/documents", timeRequired: "3 minutes", impact: "Medium",
    whyRecommends: "Unread or misunderstood documents are one of the most persistent sources of anxiety in debt situations. Once Mina analyzes it, the uncertainty disappears.",
  };
}

function deriveMemoryCards(d: OnboardingData, main: string, fear: string, style: string, phase: CurrentPhase): MemoryCard[] {
  const avoider = d.behaviorPatterns.some(b => b.toLowerCase().includes("avoid") || b.toLowerCase().includes("ignore"));
  const multi = d.pressureSources.length > 1;
  return [
    { label: "What you're carrying", value: multi ? `${d.pressureSources.length} sources of pressure` : main,
      coachingNote: multi ? "Multiple sources tracked." : "This is where Mina focuses first." },
    { label: "What worries you most", value: fear,
      coachingNote: avoider ? "Mina works around this." : "Noted across multiple answers." },
    { label: "How you prefer support", value: style,
      coachingNote: "Shapes every response." },
    { label: "Where you are now", value: phase,
      coachingNote: "Updates as you take action." },
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
    const hero = deriveHero(raw);
    const action = derivePrimaryAction(raw);
    const journeyPhases = ["Stabilize", "Understand", "Protect", "Act", "Resolve", "Recover"];
    const currentJourneyIndex = Math.max(0, journeyPhases.indexOf(phase));
    const mainPressure = raw.pressureSources.length > 0
      ? (raw.pressureSources.length === 1 ? raw.pressureSources[0] : `${raw.pressureSources.length} debt sources`)
      : "General financial pressure";
    return {
      firstName: "there",
      pressureState, pressureStateColor: STATE_COLOR[pressureState], currentPhase: phase,
      heroObservation: hero.observation,
      heroInsight: hero.insight,
      heroClosing: hero.closing,
      heroFocus: hero.focus,
      primaryAction: action,
      memoryCards: deriveMemoryCards(raw, mainPressure,
        raw.fears.length > 0 ? raw.fears[0] : "Making the wrong move",
        raw.supportStyle[0] ?? "Step-by-step guidance", phase),
      journeyPhases, currentJourneyIndex,
      journeyProgress: Math.round((currentJourneyIndex / (journeyPhases.length - 1)) * 100),
      nextMilestoneName: NEXT_MILESTONES[journeyPhases[currentJourneyIndex]] ?? "",
    };
  }, [raw]);
}
