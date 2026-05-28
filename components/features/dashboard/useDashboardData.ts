"use client";

import { useMemo } from "react";
import { OnboardingData, initialOnboardingData } from "@/components/features/onboarding/types";

export type PressureState = "Calm" | "Rising" | "High" | "Crisis";
export type CurrentPhase = "Stabilize" | "Protect" | "Act" | "Recover";
export type EmotionalState = "Overwhelmed" | "Uncertain" | "Defensive" | "Preparing" | "Focused" | "Recovering";

export interface PressureArea {
  label: string;
  status: "Clear" | "Needs attention" | "Watch" | "Act now";
  statusColor: string;
  route: string;
}

export interface NextBestAction {
  action: string;
  estimatedTime: string;
  impact: "High" | "Medium" | "Low";
  reason: string;
  route: string;
}

export interface MemoryCard {
  label: string;
  value: string;
  evolutionLabel: string;
}

export interface DashboardData {
  firstName: string;
  pressureState: PressureState;
  pressureStateColor: string;
  currentPhase: CurrentPhase;
  coachInsight: string;
  coachFocus: string;
  recommendation: string;
  recommendedRoute: string;
  nextBestAction: NextBestAction;
  recoveryReadiness: number;
  emotionalState: EmotionalState;
  emotionalStateColor: string;
  memoryCards: MemoryCard[];
  pressureAreas: PressureArea[];
  journeyPhases: string[];
  currentJourneyIndex: number;
  journeyProgress: number;
  nextMilestoneName: string;
  behaviorObservation: string;
}

function load(): OnboardingData {
  if (typeof window === "undefined") return initialOnboardingData;
  try {
    const raw = sessionStorage.getItem("mina_onboarding_v2");
    if (raw) return { ...initialOnboardingData, ...JSON.parse(raw) };
  } catch {}
  return initialOnboardingData;
}

function pressureStateColor(s: PressureState): string {
  return { Calm: "#22c55e", Rising: "#f59e0b", High: "#f97316", Crisis: "#ef4444" }[s];
}

function derivePhase(d: OnboardingData): CurrentPhase {
  const hasLegal = d.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  if (d.urgencyLevel >= 4 || d.hardestThings.some(h => h.toLowerCase().includes("overwhelm"))) return "Stabilize";
  if (hasLegal || d.fears.includes("Being sued") || d.fears.includes("Wage garnishment")) return "Protect";
  return "Stabilize";
}

function deriveEmotionalState(d: OnboardingData): { state: EmotionalState; color: string } {
  const avoider = d.behaviorPatterns.some(b => b.toLowerCase().includes("avoid") || b.toLowerCase().includes("ignore"));
  const panicker = d.behaviorPatterns.some(b => b.toLowerCase().includes("panic") || b.toLowerCase().includes("agree"));
  const hasLegal = d.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const map: Record<EmotionalState, string> = {
    Overwhelmed: "#ef4444", Uncertain: "#f59e0b", Defensive: "#f97316",
    Preparing: "#818CF8", Focused: "#00C9A7", Recovering: "#22c55e",
  };
  let state: EmotionalState = "Uncertain";
  if (d.urgencyLevel >= 5) state = "Overwhelmed";
  else if (d.urgencyLevel === 4 && hasLegal) state = "Defensive";
  else if (d.urgencyLevel === 4) state = "Overwhelmed";
  else if (hasLegal || d.fears.includes("Being sued")) state = "Defensive";
  else if (avoider && d.urgencyLevel >= 3) state = "Defensive";
  else if (panicker) state = "Uncertain";
  else if (d.urgencyLevel <= 2 && d.supportStyle.length > 0) state = "Preparing";
  else if (d.urgencyLevel === 3) state = "Uncertain";
  else state = "Preparing";
  return { state, color: map[state] };
}

function deriveRecoveryReadiness(d: OnboardingData): number {
  let score = 12;
  if (d.pressureSources.length > 0) score += 8;
  if (d.hardestThings.length > 0) score += 5;
  if (d.urgencyLevel !== 3) score += 4;
  if (d.fears.length > 0) score += 5;
  if (d.behaviorPatterns.length > 0) score += 7;
  if (d.supportStyle.length > 0) score += 5;
  return Math.min(score, 46);
}

function deriveCoachInsight(d: OnboardingData): { insight: string; focus: string } {
  const main = d.pressureSources[0]?.toLowerCase() ?? "financial uncertainty";
  const fear = d.fears[0]?.toLowerCase() ?? "the unknown";
  const style = d.supportStyle[0]?.toLowerCase() ?? "step-by-step guidance";
  const avoider = d.behaviorPatterns.some(b => b.toLowerCase().includes("avoid") || b.toLowerCase().includes("ignore"));
  const panicker = d.behaviorPatterns.some(b => b.toLowerCase().includes("panic") || b.toLowerCase().includes("agree"));
  const hasLegal = d.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));

  const behaviorLine = avoider
    ? "When pressure rises, you tend to step back from difficult conversations to avoid making the wrong move."
    : panicker
    ? "When pressure rises, you tend to respond quickly — sometimes before fully understanding what you are agreeing to."
    : "When pressure rises, you tend to slow down and gather more information before acting.";

  const fearLine = `Your biggest concern right now is ${fear}.`;

  const focusLine = hasLegal
    ? "Because of that, Mina will help you understand every document before responding, and identify your legal options clearly."
    : avoider
    ? "Because of that, Mina will help you prepare responses in advance — so you can engage on your terms, not from fear."
    : panicker
    ? "Because of that, Mina will give you pause phrases for every difficult conversation — so you stop before agreeing to anything."
    : `Because of that, Mina will focus on ${style} — building your confidence before each decision.`;

  const insight = `You told Mina that ${main} is creating the most pressure for you right now. ${behaviorLine} ${fearLine} ${focusLine}`;
  const focus = avoider ? "Prepare your response before the pressure arrives — not in the middle of it."
    : panicker ? "Practice pausing before responding. Silence is not agreement."
    : hasLegal ? "Do not ignore any legal notice. Upload it first so Mina can explain what it actually requires."
    : "Review what is causing the most pressure before taking any action.";

  return { insight, focus };
}

function deriveNextBestAction(d: OnboardingData): NextBestAction {
  const hasLegal = d.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const hasCollectors = d.pressureSources.some(s => s.toLowerCase().includes("collector"));
  const highUrgency = d.urgencyLevel >= 4;

  if (hasLegal) return {
    action: "Upload the legal notice or summons you received.",
    estimatedTime: "3 minutes",
    impact: "High",
    reason: "Mina can identify deadlines, identify your rights under FDCPA and FCRA, and outline your response options before any deadline passes.",
    route: "/documents",
  };
  if (hasCollectors) return {
    action: "Prepare your response before the next collector call.",
    estimatedTime: "5 minutes",
    impact: "High",
    reason: "Mina will give you exact phrases to use, help you identify pressure tactics, and keep a record of what was said.",
    route: "/live-call",
  };
  if (highUrgency) return {
    action: "Open Stabilize Mode and tell Mina what is weighing on you most.",
    estimatedTime: "3 minutes",
    impact: "High",
    reason: "When pressure is high, decisions made under stress are rarely the right ones. Mina will help you slow down before anything else.",
    route: "/stabilize",
  };
  return {
    action: "Upload the most stressful letter or notice you have received.",
    estimatedTime: "3 minutes",
    impact: "Medium",
    reason: "Mina can identify deadlines, pressure tactics, and your response options — turning confusion into clarity.",
    route: "/documents",
  };
}

function derivePressureAreas(d: OnboardingData): PressureArea[] {
  const hasCollectors = d.pressureSources.some(s => s.toLowerCase().includes("collector"));
  const hasLegal = d.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const highUrgency = d.urgencyLevel >= 4;
  return [
    { label: "Calls", status: hasCollectors ? (highUrgency ? "Act now" : "Needs attention") : "Clear", statusColor: hasCollectors ? (highUrgency ? "#ef4444" : "#f59e0b") : "#22c55e", route: "/live-call" },
    { label: "Documents", status: d.pressureSources.length > 0 ? "Needs attention" : "Clear", statusColor: d.pressureSources.length > 0 ? "#f59e0b" : "#22c55e", route: "/documents" },
    { label: "Decisions", status: d.behaviorPatterns.some(b => b.toLowerCase().includes("panic") || b.toLowerCase().includes("agree")) ? "Watch" : "Clear", statusColor: d.behaviorPatterns.some(b => b.toLowerCase().includes("panic")) ? "#f97316" : "#22c55e", route: "/decisions" },
    { label: "Legal risk", status: hasLegal ? "Act now" : d.fears.includes("Being sued") ? "Watch" : "Clear", statusColor: hasLegal ? "#ef4444" : d.fears.includes("Being sued") ? "#f97316" : "#22c55e", route: "/legal-support" },
    { label: "Recovery", status: "Needs attention", statusColor: "#f59e0b", route: "/recovery" },
  ];
}

function deriveBehaviorObservation(d: OnboardingData): string {
  const avoider = d.behaviorPatterns.some(b => b.toLowerCase().includes("avoid") || b.toLowerCase().includes("ignore"));
  const panicker = d.behaviorPatterns.some(b => b.toLowerCase().includes("panic") || b.toLowerCase().includes("agree quickly"));
  const shutsDown = d.behaviorPatterns.some(b => b.toLowerCase().includes("shut down"));
  const hasLegalFear = d.fears.includes("Being sued") || d.fears.includes("Wage garnishment");
  const hasStepByStep = d.supportStyle.some(s => s.toLowerCase().includes("step"));
  const hasFast = d.supportStyle.some(s => s.toLowerCase().includes("fast"));
  const ashamed = d.hardestThings.some(h => h.toLowerCase().includes("ashamed"));
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

function deriveMemoryCards(d: OnboardingData, mainPressure: string, fearPattern: string, supportStyle: string, phase: CurrentPhase): MemoryCard[] {
  const avoider = d.behaviorPatterns.some(b => b.toLowerCase().includes("avoid") || b.toLowerCase().includes("ignore"));
  return [
    { label: "Main pressure", value: mainPressure, evolutionLabel: d.pressureSources.length > 1 ? "Multiple sources tracked" : "Identified from onboarding" },
    { label: "Fear pattern", value: fearPattern, evolutionLabel: avoider ? "Mina adjusts around this" : "Pattern becoming clearer" },
    { label: "Support style", value: supportStyle, evolutionLabel: "Shapes every response" },
    { label: "Current phase", value: phase, evolutionLabel: "Updates as you progress" },
  ];
}

export function useDashboardData(): DashboardData {
  const raw = useMemo(() => load(), []);
  return useMemo(() => {
    const pressureState = raw.urgencyLevel <= 1 ? "Calm" : raw.urgencyLevel <= 2 ? "Rising" : raw.urgencyLevel <= 3 ? "High" : "Crisis" as PressureState;
    const phase = derivePhase(raw);
    const em = deriveEmotionalState(raw);
    const coach = deriveCoachInsight(raw);
    const nba = deriveNextBestAction(raw);
    const journeyPhases = ["Stabilize", "Understand", "Protect", "Act", "Resolve", "Recover"];
    const currentJourneyIndex = Math.max(0, journeyPhases.indexOf(phase));
    const mainPressure = raw.pressureSources.length > 0 ? (raw.pressureSources.length === 1 ? raw.pressureSources[0] : `${raw.pressureSources.length} debt sources`) : "General financial pressure";
    const fearPattern = raw.fears.length > 0 ? raw.fears[0] : "Managing uncertainty";
    const supportStyle = raw.supportStyle[0] ?? "Step-by-step guidance";
    return {
      firstName: "there",
      pressureState,
      pressureStateColor: pressureStateColor(pressureState),
      currentPhase: phase,
      coachInsight: coach.insight,
      coachFocus: coach.focus,
      recommendation: nba.action,
      recommendedRoute: nba.route,
      nextBestAction: nba,
      recoveryReadiness: deriveRecoveryReadiness(raw),
      emotionalState: em.state,
      emotionalStateColor: em.color,
      memoryCards: deriveMemoryCards(raw, mainPressure, fearPattern, supportStyle, phase),
      pressureAreas: derivePressureAreas(raw),
      journeyPhases,
      currentJourneyIndex,
      journeyProgress: Math.round((currentJourneyIndex / (journeyPhases.length - 1)) * 100),
      nextMilestoneName: NEXT_MILESTONES[journeyPhases[currentJourneyIndex]] ?? "",
      behaviorObservation: deriveBehaviorObservation(raw),
    };
  }, [raw]);
}
