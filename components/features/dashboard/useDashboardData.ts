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

export interface WorkspaceItem {
  label: string;
  route: string;
  icon: string;
  locked?: boolean;
}

export interface DashboardData {
  // User
  firstName: string;

  // Mina Insight
  pressureState: PressureState;
  pressureStateColor: string;
  currentPhase: CurrentPhase;
  insightText: string;
  recommendation: string;
  recommendedRoute: string;

  // Today's Next Move
  nextMoveLabel: string;
  nextMoveRoute: string;
  nextMoveDetail: string;

  // Mina Memory
  mainPressure: string;
  fearPattern: string;
  supportStyle: string;
  currentPhaseName: string;

  // Pressure Map
  pressureAreas: PressureArea[];

  // Recovery Journey
  journeyPhases: string[];
  currentJourneyIndex: number;

  // Mina Noticed
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
  return {
    Calm: "#22c55e",
    Rising: "#f59e0b",
    High: "#f97316",
    Crisis: "#ef4444",
  }[state];
}

function derivePhase(data: OnboardingData): CurrentPhase {
  const hasLegal = data.pressureSources.some((s) =>
    s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal")
  );
  const highUrgency = data.urgencyLevel >= 4;
  if (highUrgency || data.hardestThings.includes("I feel overwhelmed") || data.hardestThings.includes("I can't think clearly")) {
    return "Stabilize";
  }
  if (hasLegal || data.fears.includes("Being sued") || data.fears.includes("Wage garnishment")) {
    return "Protect";
  }
  if (data.pressureSources.length === 0) return "Stabilize";
  return "Stabilize";
}

function deriveInsight(data: OnboardingData): string {
  const count = data.pressureSources.length;
  const hasCollectors = data.pressureSources.some((s) => s.toLowerCase().includes("collector"));
  const hasMedical = data.pressureSources.some((s) => s.toLowerCase().includes("medical"));
  const hasIRS = data.pressureSources.some((s) => s.toLowerCase().includes("irs") || s.toLowerCase().includes("tax"));
  const hasLegal = data.pressureSources.some((s) => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const avoider = data.behaviorPatterns.some((b) => b.toLowerCase().includes("avoid"));
  const panicker = data.behaviorPatterns.some((b) => b.toLowerCase().includes("panic"));

  if (count === 0) {
    return "You are not dealing with a money problem. You are dealing with pressure, uncertainty, and the weight of decisions that feel too big to make alone.";
  }
  if (hasLegal) {
    return "You're navigating active legal pressure — the kind that feels like every move could be the wrong one. Mina will help you understand your rights before you respond to anything.";
  }
  if (hasCollectors && avoider) {
    return "You're not avoiding the problem. You're avoiding the pressure that comes with it. Mina will help you respond on your own terms, at your own pace.";
  }
  if (hasMedical) {
    return "Medical debt carries a specific kind of stress — it was not your choice, and the billing system is built to confuse. Mina will help you understand what you actually owe and what you have the right to dispute.";
  }
  if (hasIRS) {
    return "IRS pressure feels absolute, but you have more options than most people realize. Mina will help you understand exactly where you stand before taking any action.";
  }
  if (panicker) {
    return "You're not just dealing with debt pressure. You're trying to avoid making the wrong move while under stress. Mina will help you slow down before you respond to anything.";
  }
  if (count >= 3) {
    return "Multiple debt sources create a specific kind of overwhelm — it's hard to know where to start. Mina will help you see the full picture and identify what actually needs your attention first.";
  }
  return "You're dealing with real pressure, and the weight of it affects every decision. Mina will help you understand what is actually happening and what your next move should be.";
}

function deriveRecommendation(data: OnboardingData): { text: string; route: string } {
  const hasLegal = data.pressureSources.some((s) => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const hasCollectors = data.pressureSources.some((s) => s.toLowerCase().includes("collector"));
  const highUrgency = data.urgencyLevel >= 4;

  if (hasLegal) return {
    text: "Upload any legal notice or summons so Mina can analyze it before you respond.",
    route: "/documents",
  };
  if (hasCollectors) return {
    text: "Open a Live Call session before your next collector call.",
    route: "/live-call",
  };
  if (highUrgency) return {
    text: "Start Stabilize Mode to slow down the pressure before making any decisions.",
    route: "/stabilize",
  };
  return {
    text: "Begin Stabilize Mode — let Mina help you take the first clear step.",
    route: "/stabilize",
  };
}

function deriveNextMove(data: OnboardingData): { label: string; detail: string; route: string } {
  const hasCollectors = data.pressureSources.some((s) => s.toLowerCase().includes("collector"));
  const hasLegal = data.pressureSources.some((s) => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const highUrgency = data.urgencyLevel >= 4;

  if (hasLegal) return {
    label: "Upload the most stressful notice you have received",
    detail: "Mina will analyze it and explain exactly what it means and what you can do.",
    route: "/documents",
  };
  if (hasCollectors) return {
    label: "Prepare for a collector call before it happens",
    detail: "Open a Live Call session now. You can practice what to say before the phone rings.",
    route: "/live-call",
  };
  if (highUrgency) return {
    label: "Start Stabilize Mode",
    detail: "Your situation feels overwhelming. Mina will help you slow down and focus on one step.",
    route: "/stabilize",
  };
  return {
    label: "Start Stabilize Mode",
    detail: "Begin with a calm conversation. Tell Mina what is on your mind right now.",
    route: "/stabilize",
  };
}

function derivePressureAreas(data: OnboardingData): PressureArea[] {
  const hasCollectors = data.pressureSources.some((s) => s.toLowerCase().includes("collector"));
  const hasLegal = data.pressureSources.some((s) => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const highUrgency = data.urgencyLevel >= 4;

  return [
    {
      label: "Calls",
      status: hasCollectors ? (highUrgency ? "Act now" : "Needs attention") : "Clear",
      statusColor: hasCollectors ? (highUrgency ? "#ef4444" : "#f59e0b") : "#22c55e",
    },
    {
      label: "Documents",
      status: data.pressureSources.length > 0 ? "Needs attention" : "Clear",
      statusColor: data.pressureSources.length > 0 ? "#f59e0b" : "#22c55e",
    },
    {
      label: "Decisions",
      status: data.behaviorPatterns.some((b) => b.toLowerCase().includes("panic") || b.toLowerCase().includes("agree")) ? "Watch" : "Clear",
      statusColor: data.behaviorPatterns.some((b) => b.toLowerCase().includes("panic")) ? "#f97316" : "#22c55e",
    },
    {
      label: "Legal risk",
      status: hasLegal ? "Act now" : data.fears.includes("Being sued") ? "Watch" : "Clear",
      statusColor: hasLegal ? "#ef4444" : data.fears.includes("Being sued") ? "#f97316" : "#22c55e",
    },
    {
      label: "Recovery",
      status: "Needs attention",
      statusColor: "#f59e0b",
    },
  ];
}

function deriveBehaviorObservation(data: OnboardingData): string {
  const avoider = data.behaviorPatterns.some((b) => b.toLowerCase().includes("avoid"));
  const panicker = data.behaviorPatterns.some((b) => b.toLowerCase().includes("panic"));
  const hasLegalFear = data.fears.includes("Being sued") || data.fears.includes("Wage garnishment");
  const overagreeer = data.behaviorPatterns.some((b) => b.toLowerCase().includes("agree") || b.toLowerCase().includes("quickly"));

  if (avoider) {
    return "You selected that pressure makes you avoid calls and conversations. Mina will focus on helping you slow down, prepare your response, and approach calls when you are ready — not when you are afraid.";
  }
  if (panicker && overagreeer) {
    return "You tend to panic and agree quickly under pressure. Mina will interrupt that pattern — giving you exact words to pause the conversation before you commit to anything.";
  }
  if (hasLegalFear) {
    return "You seem most worried about legal consequences. Mina will prioritize document analysis and guide you toward professional support before any legal deadline.";
  }
  if (data.hardestThings.includes("I feel ashamed")) {
    return "Shame is one of the most common — and most invisible — parts of debt pressure. Mina will never judge. Every conversation here is private and focused on what helps you move forward.";
  }
  return "Based on what you shared, Mina has noted your pressure patterns. Every recommendation will be shaped around how you actually think and respond — not a generic script.";
}

export function useDashboardData(): DashboardData {
  const raw = useMemo(() => loadOnboarding(), []);

  return useMemo(() => {
    const pressureState = derivePressureState(raw.urgencyLevel);
    const phase = derivePhase(raw);
    const insight = deriveInsight(raw);
    const rec = deriveRecommendation(raw);
    const nextMove = deriveNextMove(raw);

    const mainPressure = raw.pressureSources.length > 0
      ? raw.pressureSources.length === 1
        ? raw.pressureSources[0]
        : `${raw.pressureSources.length} debt sources`
      : "General financial pressure";

    const fearPattern = raw.fears.length > 0
      ? raw.fears[0]
      : "Managing uncertainty";

    const style = raw.supportStyle[0] ?? "Step-by-step guidance";

    return {
      firstName: "there", // replaced by real name after auth

      pressureState,
      pressureStateColor: pressureStateColor(pressureState),
      currentPhase: phase,
      insightText: insight,
      recommendation: rec.text,
      recommendedRoute: rec.route,

      nextMoveLabel: nextMove.label,
      nextMoveRoute: nextMove.route,
      nextMoveDetail: nextMove.detail,

      mainPressure,
      fearPattern,
      supportStyle: style,
      currentPhaseName: phase,

      pressureAreas: derivePressureAreas(raw),

      journeyPhases: ["Stabilize", "Understand", "Protect", "Act", "Resolve", "Recover"],
      currentJourneyIndex: ["Stabilize", "Protect", "Act", "Recover"].indexOf(phase) >= 0
        ? ["Stabilize", "Protect", "Act", "Recover"].indexOf(phase)
        : 0,

      behaviorObservation: deriveBehaviorObservation(raw),
    };
  }, [raw]);
}
