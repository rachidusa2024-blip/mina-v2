"use client";

import { useMemo } from "react";
import { OnboardingData, initialOnboardingData } from "@/components/features/onboarding/types";

export type PressureState = "Calm" | "Rising" | "High" | "Crisis";
export type CurrentPhase = "Stabilize" | "Protect" | "Act" | "Recover";

export interface PressureArea {
  label: string;
  status: "Clear" | "Needs attention" | "Watch" | "Act now";
  statusColor: string;
}

export interface DashboardData {
  firstName: string;
  pressureState: PressureState;
  pressureStateColor: string;
  currentPhase: CurrentPhase;
  coachInsight: string;
  coachFocus: string;
  confidenceScore: number;
  recommendation: string;
  recommendedRoute: string;
  nextMoveLabel: string;
  nextMoveRoute: string;
  nextMoveDetail: string;
  mainPressure: string;
  fearPattern: string;
  supportStyle: string;
  currentPhaseName: string;
  pressureAreas: PressureArea[];
  journeyPhases: string[];
  currentJourneyIndex: number;
  nextMilestoneName: string;
  behaviorObservation: string;
}

function loadOnboarding(): OnboardingData {
  if (typeof window === "undefined") return initialOnboardingData;
  try {
    const raw = sessionStorage.getItem("mina_onboarding_v2");
    if (raw) return { ...initialOnboardingData, ...JSON.parse(raw) };
  } catch {}
  return initialOnboardingData;
}

function derivePressureState(urgency: number): PressureState {
  if (urgency <= 1) return "Calm";
  if (urgency <= 2) return "Rising";
  if (urgency <= 3) return "High";
  return "Crisis";
}

function pressureStateColor(state: PressureState): string {
  return { Calm: "#22c55e", Rising: "#f59e0b", High: "#f97316", Crisis: "#ef4444" }[state];
}

function derivePhase(data: OnboardingData): CurrentPhase {
  const hasLegal = data.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  if (data.urgencyLevel >= 4 || data.hardestThings.some(h => h.toLowerCase().includes("overwhelm"))) return "Stabilize";
  if (hasLegal || data.fears.includes("Being sued") || data.fears.includes("Wage garnishment")) return "Protect";
  return "Stabilize";
}

function deriveConfidence(data: OnboardingData): number {
  let score = 38;
  if (data.pressureSources.length > 0) score += 14;
  if (data.hardestThings.length > 0) score += 10;
  if (data.urgencyLevel !== 3) score += 8;
  if (data.fears.length > 0) score += 10;
  if (data.behaviorPatterns.length > 0) score += 14;
  if (data.supportStyle.length > 0) score += 10;
  return Math.min(score, 94);
}

function deriveCoachInsight(data: OnboardingData): { insight: string; focus: string } {
  const avoider = data.behaviorPatterns.some(b => b.toLowerCase().includes("avoid") || b.toLowerCase().includes("ignore"));
  const panicker = data.behaviorPatterns.some(b => b.toLowerCase().includes("panic") || b.toLowerCase().includes("agree"));
  const overwhelmed = data.hardestThings.some(h => h.toLowerCase().includes("overwhelm") || h.toLowerCase().includes("clearly"));
  const ashamed = data.hardestThings.some(h => h.toLowerCase().includes("ashamed"));
  const delayer = data.hardestThings.some(h => h.toLowerCase().includes("delay") || h.toLowerCase().includes("stuck"));
  const hasLegal = data.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const hasCollectors = data.pressureSources.some(s => s.toLowerCase().includes("collector"));
  const mainSource = data.pressureSources[0]?.toLowerCase() ?? "financial uncertainty";

  if (hasLegal) {
    return {
      insight: `You told Mina that legal pressure is part of what you are facing. Legal notices are designed to feel final — they are not. You have rights that most people in your position do not know about, and many of those rights come with deadlines. Mina will help you understand exactly what each document means before you decide what to do next.`,
      focus: "Do not ignore any legal notice. Upload it first so Mina can explain what it actually requires.",
    };
  }
  if (avoider) {
    return {
      insight: `You told Mina that ${mainSource} is putting the most pressure on you right now. When pressure increases, you tend to step back from difficult conversations — not because you do not care, but because making the wrong move feels worse than waiting. That instinct has protected you before. Mina will help you know when to wait and when it is actually safe to respond.`,
      focus: "Prepare what to say before the pressure arrives — not in the middle of it.",
    };
  }
  if (panicker) {
    return {
      insight: `You told Mina that ${mainSource} is creating significant stress. Under pressure, you tend to respond quickly — often before you have had time to think through what you are agreeing to. This is not a character flaw. It is what happens when people are trained to feel that silence means failure. Mina will slow the conversation down so you can respond with clarity instead of fear.`,
      focus: "Practice pausing before responding to any financial request. Silence is not agreement.",
    };
  }
  if (ashamed) {
    return {
      insight: `You are dealing with something that carries real weight — and you are dealing with it honestly. The shame that comes with debt pressure is one of its cruelest parts, because it makes people feel like they deserve what is happening to them. You do not. Mina will help you focus on what you can control and what your actual options are.`,
      focus: "Start with one small action today. Not because it will fix everything — because it will remind you that you can move forward.",
    };
  }
  if (overwhelmed) {
    return {
      insight: `You told Mina that you are having trouble thinking clearly right now. That is not a sign of weakness — it is what happens when multiple pressures arrive at the same time. Your brain is trying to process too many things at once. Mina will help you slow down, pick one thing, and move from there.`,
      focus: "Do not try to solve everything today. Identify the single most urgent item and start there.",
    };
  }
  if (delayer) {
    return {
      insight: `You told Mina that uncertainty is your biggest source of pressure. When things feel unclear, you tend to gather more information before making a decision. That is not weakness — it is how you protect yourself from mistakes. Mina will help you understand the situation clearly enough that moving forward feels safe, not risky.`,
      focus: "Review what is causing the most pressure before taking any action.",
    };
  }
  if (hasCollectors) {
    return {
      insight: `You told Mina that debt collectors are part of the pressure you are facing. Collector calls are built to create urgency — and that urgency is often manufactured. You have legal rights that limit what collectors can say and do. Mina will help you understand those rights and give you the exact words to use when they call.`,
      focus: "Prepare your standard response before the next call. Do not improvise under pressure.",
    };
  }
  return {
    insight: `You shared your situation with Mina. Financial pressure is not just about money — it is about the decisions you have to make while carrying a weight that most people cannot see. Mina is here to help you make those decisions more clearly, with less fear, one step at a time.`,
    focus: "Open Stabilize Mode and tell Mina what is weighing on you most right now.",
  };
}

function deriveRecommendation(data: OnboardingData): { text: string; route: string } {
  const hasLegal = data.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const hasCollectors = data.pressureSources.some(s => s.toLowerCase().includes("collector"));
  if (hasLegal) return { text: "Upload any legal notice so Mina can analyze it before you respond.", route: "/documents" };
  if (hasCollectors) return { text: "Open a Live Call session before your next collector call.", route: "/live-call" };
  if (data.urgencyLevel >= 4) return { text: "Start Stabilize Mode to slow down the pressure before making any decisions.", route: "/stabilize" };
  return { text: "Begin Stabilize Mode — let Mina help you take the first clear step.", route: "/stabilize" };
}

function deriveNextMove(data: OnboardingData): { label: string; detail: string; route: string } {
  const hasCollectors = data.pressureSources.some(s => s.toLowerCase().includes("collector"));
  const hasLegal = data.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  if (hasLegal) return { label: "Upload the most stressful notice you have received", detail: "Mina will analyze it and explain what it means and what you can do.", route: "/documents" };
  if (hasCollectors) return { label: "Prepare for a collector call before it happens", detail: "Open a Live Call session. Practice what to say before the phone rings.", route: "/live-call" };
  if (data.urgencyLevel >= 4) return { label: "Start Stabilize Mode", detail: "Your situation feels overwhelming. Mina will help you slow down and focus on one step.", route: "/stabilize" };
  return { label: "Start Stabilize Mode", detail: "Begin with a calm conversation. Tell Mina what is on your mind right now.", route: "/stabilize" };
}

function derivePressureAreas(data: OnboardingData): PressureArea[] {
  const hasCollectors = data.pressureSources.some(s => s.toLowerCase().includes("collector"));
  const hasLegal = data.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const highUrgency = data.urgencyLevel >= 4;
  return [
    { label: "Calls", status: hasCollectors ? (highUrgency ? "Act now" : "Needs attention") : "Clear", statusColor: hasCollectors ? (highUrgency ? "#ef4444" : "#f59e0b") : "#22c55e" },
    { label: "Documents", status: data.pressureSources.length > 0 ? "Needs attention" : "Clear", statusColor: data.pressureSources.length > 0 ? "#f59e0b" : "#22c55e" },
    { label: "Decisions", status: data.behaviorPatterns.some(b => b.toLowerCase().includes("panic") || b.toLowerCase().includes("agree")) ? "Watch" : "Clear", statusColor: data.behaviorPatterns.some(b => b.toLowerCase().includes("panic")) ? "#f97316" : "#22c55e" },
    { label: "Legal risk", status: hasLegal ? "Act now" : data.fears.includes("Being sued") ? "Watch" : "Clear", statusColor: hasLegal ? "#ef4444" : data.fears.includes("Being sued") ? "#f97316" : "#22c55e" },
    { label: "Recovery", status: "Needs attention", statusColor: "#f59e0b" },
  ];
}

function deriveBehaviorObservation(data: OnboardingData): string {
  const avoider = data.behaviorPatterns.some(b => b.toLowerCase().includes("avoid") || b.toLowerCase().includes("ignore"));
  const panicker = data.behaviorPatterns.some(b => b.toLowerCase().includes("panic") || b.toLowerCase().includes("agree quickly"));
  const shutsDown = data.behaviorPatterns.some(b => b.toLowerCase().includes("shut down"));
  const hasLegalFear = data.fears.includes("Being sued") || data.fears.includes("Wage garnishment");
  const hasStepByStep = data.supportStyle.some(s => s.toLowerCase().includes("step"));
  const hasFast = data.supportStyle.some(s => s.toLowerCase().includes("fast"));
  const ashamed = data.hardestThings.some(h => h.toLowerCase().includes("ashamed"));

  if (avoider && hasLegalFear) return "You selected that pressure makes you avoid difficult conversations, and you shared that legal consequences worry you most. Mina will prioritize helping you understand your rights before any deadline arrives — so avoiding feels less necessary.";
  if (avoider) return "You selected that pressure makes you avoid calls and conversations. Mina will help you slow down before responding, so you can engage on your own terms instead of from fear.";
  if (panicker) return "You indicated that you tend to agree to things quickly under pressure. Mina will give you a pause phrase for every difficult conversation — one that buys you time without escalating the situation.";
  if (shutsDown) return "You shared that you tend to shut down emotionally when pressure increases. Mina will keep responses short and focused during those moments — one action at a time, nothing overwhelming.";
  if (hasLegalFear) return "You indicated legal consequences are your biggest fear. Mina will prioritize documentation, explain your consumer rights, and guide you toward professional resources when legal risk is real.";
  if (ashamed) return "You shared that shame is part of what you are carrying. Mina will never respond with judgment. Every conversation here is private, and every recommendation is focused on what moves you forward — not on what went wrong.";
  if (hasStepByStep) return "You asked Mina for step-by-step guidance. Mina will never give you a long list of tasks. Every session will focus on the next single step — and only that step.";
  if (hasFast) return "You asked for fast, direct answers. Mina will lead with what you need to know first, and keep explanations short unless you ask for more.";
  return "Based on what you shared, Mina has built a picture of how you think and respond under pressure. Every recommendation going forward will be shaped around your actual patterns — not a generic script.";
}

const NEXT_MILESTONES: Record<string, string> = {
  Stabilize: "Understand what is creating pressure",
  Understand: "Identify and protect your position",
  Protect: "Take deliberate action on priority items",
  Act: "Resolve active debt situations",
  Resolve: "Begin rebuilding financial stability",
  Recover: "Maintain long-term financial control",
};

export function useDashboardData(): DashboardData {
  const raw = useMemo(() => loadOnboarding(), []);
  return useMemo(() => {
    const pressureState = derivePressureState(raw.urgencyLevel);
    const phase = derivePhase(raw);
    const rec = deriveRecommendation(raw);
    const nextMove = deriveNextMove(raw);
    const coach = deriveCoachInsight(raw);
    const journeyPhases = ["Stabilize", "Understand", "Protect", "Act", "Resolve", "Recover"];
    const currentJourneyIndex = Math.max(0, journeyPhases.indexOf(phase));
    const mainPressure = raw.pressureSources.length > 0
      ? raw.pressureSources.length === 1 ? raw.pressureSources[0] : `${raw.pressureSources.length} debt sources`
      : "General financial pressure";
    return {
      firstName: "there",
      pressureState,
      pressureStateColor: pressureStateColor(pressureState),
      currentPhase: phase,
      coachInsight: coach.insight,
      coachFocus: coach.focus,
      confidenceScore: deriveConfidence(raw),
      recommendation: rec.text,
      recommendedRoute: rec.route,
      nextMoveLabel: nextMove.label,
      nextMoveRoute: nextMove.route,
      nextMoveDetail: nextMove.detail,
      mainPressure,
      fearPattern: raw.fears.length > 0 ? raw.fears[0] : "Managing uncertainty",
      supportStyle: raw.supportStyle[0] ?? "Step-by-step guidance",
      currentPhaseName: phase,
      pressureAreas: derivePressureAreas(raw),
      journeyPhases,
      currentJourneyIndex,
      nextMilestoneName: NEXT_MILESTONES[journeyPhases[currentJourneyIndex]] ?? "",
      behaviorObservation: deriveBehaviorObservation(raw),
    };
  }, [raw]);
}
