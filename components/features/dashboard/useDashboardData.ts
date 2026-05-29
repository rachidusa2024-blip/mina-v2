"use client";

import { useMemo } from "react";
import { OnboardingData, initialOnboardingData } from "@/components/features/onboarding/types";

export type PressureState = "Calm" | "Rising" | "High" | "Crisis";
export type CurrentPhase = "Stabilize" | "Protect" | "Act" | "Recover";
export type EmotionalState = "Overwhelmed" | "Uncertain" | "Defensive" | "Preparing" | "Focused" | "Recovering";

export interface PressureArea {
  label: string; status: string; statusColor: string; route: string;
}
export interface NextBestAction {
  action: string; estimatedTime: string; impact: "High" | "Medium" | "Low";
  reason: string; whyRecommends: string; route: string;
}
export interface MemoryCard {
  label: string; value: string; evolutionLabel: string; coachingNote: string;
}
export interface VisitUpdate { text: string; }

export interface DashboardData {
  firstName: string;
  pressureState: PressureState; pressureStateColor: string; currentPhase: CurrentPhase;
  coachHeader: string; coachLines: string[]; coachClosing: string; coachFocus: string;
  recommendation: string; recommendedRoute: string;
  nextBestAction: NextBestAction;
  recoveryReadiness: number; emotionalState: EmotionalState; emotionalStateColor: string;
  memoryCards: MemoryCard[];
  pressureAreas: PressureArea[];
  journeyPhases: string[]; currentJourneyIndex: number;
  journeyProgress: number; nextMilestoneName: string;
  behaviorObservation: string;
  sinceLastVisitItems: VisitUpdate[];
  humanMoment: string;
}

// Rotates daily — a coach thought, not a system message
const HUMAN_MOMENTS = [
  "People often feel they must make decisions immediately. Most situations improve when you first understand the facts.",
  "Debt collectors are trained to create urgency. That urgency is almost always manufactured. You have more time than they want you to think.",
  "The goal today is not to solve everything. The goal is one clear step that makes tomorrow easier.",
  "The heaviest part of financial pressure is not the debt itself. It is the weight of not knowing what to do next.",
  "Most people in debt pressure are not bad with money. They are people who had something unexpected happen without enough protection in place.",
  "You do not need to be fully ready before you take the next step. You just need to know what it is.",
];

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

function deriveEmotional(d: OnboardingData): { state: EmotionalState; color: string } {
  const MAP: Record<EmotionalState, string> = {
    Overwhelmed: "#ef4444", Uncertain: "#f59e0b", Defensive: "#f97316",
    Preparing: "#818CF8", Focused: "#00C9A7", Recovering: "#22c55e",
  };
  const avoider = d.behaviorPatterns.some(b => b.toLowerCase().includes("avoid") || b.toLowerCase().includes("ignore"));
  const hasLegal = d.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  let state: EmotionalState = "Uncertain";
  if (d.urgencyLevel >= 4) state = hasLegal ? "Defensive" : "Overwhelmed";
  else if (hasLegal || d.fears.includes("Being sued")) state = "Defensive";
  else if (avoider && d.urgencyLevel >= 3) state = "Defensive";
  else if (d.urgencyLevel <= 2 && d.supportStyle.length > 0) state = "Preparing";
  return { state, color: MAP[state] };
}

function deriveReadiness(d: OnboardingData): number {
  let s = 12;
  if (d.pressureSources.length > 0) s += 8;
  if (d.hardestThings.length > 0) s += 5;
  if (d.urgencyLevel !== 3) s += 4;
  if (d.fears.length > 0) s += 5;
  if (d.behaviorPatterns.length > 0) s += 7;
  if (d.supportStyle.length > 0) s += 5;
  return Math.min(s, 46);
}

// ── MINA'S READ — pure emotional/behavioral interpretation ────────────────────
// Answers: "What is happening to me?"
// No recommendations. No action suggestions. Pure reading of the situation.
function deriveCoach(d: OnboardingData): { header: string; lines: string[]; closing: string; focus: string } {
  const avoider = d.behaviorPatterns.some(b => b.toLowerCase().includes("avoid") || b.toLowerCase().includes("ignore"));
  const panicker = d.behaviorPatterns.some(b => b.toLowerCase().includes("panic") || b.toLowerCase().includes("agree"));
  const shutsDown = d.behaviorPatterns.some(b => b.toLowerCase().includes("shut down"));
  const hasLegal = d.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const multiSource = d.pressureSources.length > 1;
  const highUrgency = d.urgencyLevel >= 4;

  // Line 1: what the situation feels like right now
  const situationLine = highUrgency
    ? "The pressure you are carrying right now is high enough that decisions feel dangerous — like every move could make things worse."
    : hasLegal
    ? "Legal pressure creates a specific kind of freeze. Every action feels risky because the consequences feel final."
    : multiSource
    ? "Carrying multiple debt sources at once makes it hard to know which one deserves attention first — so it can feel like nothing is moving."
    : "The pressure you are under is real. It is not just about money — it is about the weight of not knowing what happens next.";

  // Line 2: what Mina observes behaviorally
  const behaviorLine = avoider
    ? "Under this kind of pressure, stepping back from difficult conversations is a natural response. It is the mind protecting itself from the cost of being wrong."
    : panicker
    ? "Under pressure, the impulse to respond quickly — to just agree and make the stress stop — is extremely common. It is not weakness. It is what urgency does to decision-making."
    : shutsDown
    ? "When too many pressures converge, shutting down emotionally is not avoidance. It is the brain trying to prevent overload."
    : "The instinct to fully understand a situation before acting is not hesitation. It is how careful people protect themselves from costly mistakes.";

  // Line 3: the emotional core of what is happening
  const emotionLine = d.fears.includes("Being sued") || d.fears.includes("Wage garnishment")
    ? "Underneath the pressure is a specific fear: that one wrong move will trigger something irreversible. That fear is real, but the situation has more room than it feels like right now."
    : d.hardestThings.includes("I feel ashamed")
    ? "There is also shame in this — the kind that makes people feel like they caused this and deserve what is happening. That story is not accurate."
    : d.hardestThings.some(h => h.toLowerCase().includes("clearly"))
    ? "One effect of sustained pressure is that thinking becomes cloudy. Decisions that should be simple start to feel impossible."
    : "The emotional weight here is not just about debt. It is about feeling like you lost control of something that should have been manageable.";

  // Closing: what this means for Mina's approach (not a recommendation — an orientation)
  const closing = avoider
    ? "Mina's role is not to push you into action. It is to help you understand what is safe before you engage."
    : panicker
    ? "Mina's role is not to tell you what to do. It is to slow the moment down so the decision is yours — not the caller's."
    : hasLegal
    ? "Mina's role here is to help you separate what is urgent from what is fear — so you can respond with clarity instead of panic."
    : "Mina's role is to help you think clearly in a situation designed to prevent that.";

  const focus = avoider ? "Notice when avoidance feels like protection. That is the moment to pause before deciding."
    : panicker ? "Before responding to any financial request today, take 10 seconds. Urgency is almost always manufactured."
    : hasLegal ? "Do not respond to anything legal until you understand what it actually requires."
    : "Identify the single thing creating the most pressure. Everything else can wait.";

  return {
    header: "What Mina sees:",
    lines: [situationLine, behaviorLine, emotionLine],
    closing,
    focus,
  };
}

// ── SINCE YOUR LAST VISIT — pure progress ─────────────────────────────────────
// Answers: "What changed?"
// No emotional observations. No interpretations. Only progress, completions, new availability.
function deriveSinceLastVisit(d: OnboardingData, readiness: number): VisitUpdate[] {
  const items: VisitUpdate[] = [];

  // Completion of onboarding
  const completedSections = [
    d.pressureSources.length > 0,
    d.hardestThings.length > 0,
    d.fears.length > 0,
    d.behaviorPatterns.length > 0,
    d.supportStyle.length > 0,
  ].filter(Boolean).length;

  items.push({ text: `Onboarding complete — ${completedSections} of 5 sections answered` });
  items.push({ text: `Recovery readiness baseline set at ${readiness}/100` });
  items.push({ text: "Your pressure map has been built and is ready to review" });

  if (d.pressureSources.length > 0) {
    items.push({
      text: `${d.pressureSources.length} pressure source${d.pressureSources.length > 1 ? "s have" : " has"} been identified and mapped`,
    });
  }

  return items.slice(0, 4);
}

// ── NEXT BEST ACTION — pure decision logic ────────────────────────────────────
// Answers: "Why should I do this now?"
// No emotional observations. Explains leverage, timing, and consequence of not acting.
function deriveNBA(d: OnboardingData): NextBestAction {
  const hasLegal = d.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const hasCollectors = d.pressureSources.some(s => s.toLowerCase().includes("collector"));

  if (hasLegal) return {
    action: "Upload the legal notice or summons you received.",
    estimatedTime: "3 minutes", impact: "High",
    reason: "Mina can identify deadlines, your rights under FDCPA and FCRA, and your response options before any deadline passes.",
    whyRecommends: "Legal documents have hard deadlines. Letting one pass without response — even accidentally — can result in a default judgment. This is the action with the highest consequence of delay. Three minutes now eliminates that risk.",
    route: "/documents",
  };

  if (hasCollectors) return {
    action: "Prepare your response before the next collector call.",
    estimatedTime: "5 minutes", impact: "High",
    reason: "Mina will give you exact phrases to use, help you identify pressure tactics, and keep a record of what was said.",
    whyRecommends: "Collector calls are scripted to produce agreements under stress. The only way to avoid that is to have your response ready before the call — not during it. Five minutes of preparation eliminates the most common mistake in debt situations.",
    route: "/live-call",
  };

  if (d.urgencyLevel >= 4) return {
    action: "Open Stabilize Mode and tell Mina what is weighing on you most.",
    estimatedTime: "3 minutes", impact: "High",
    reason: "When pressure is high, Mina will help you identify what is actually urgent versus what only feels urgent.",
    whyRecommends: "High pressure distorts urgency. Things that can wait feel like emergencies. Things that are actually urgent get avoided. Stabilize Mode is designed specifically for this — separating real risk from perceived risk so your next action is the right one, not just the one that relieves anxiety.",
    route: "/stabilize",
  };

  return {
    action: "Upload the most stressful letter or notice you have received.",
    estimatedTime: "3 minutes", impact: "Medium",
    reason: "Mina can identify deadlines, pressure tactics, and your response options.",
    whyRecommends: "Unread or misunderstood documents are one of the most common sources of ongoing anxiety in debt situations. Once Mina analyzes it, the uncertainty disappears — and uncertainty is currently doing more damage than the document itself.",
    route: "/documents",
  };
}

function derivePressureAreas(d: OnboardingData): PressureArea[] {
  const hasCollectors = d.pressureSources.some(s => s.toLowerCase().includes("collector"));
  const hasLegal = d.pressureSources.some(s => s.toLowerCase().includes("lawsuit") || s.toLowerCase().includes("legal"));
  const high = d.urgencyLevel >= 4;
  return [
    { label: "Calls", status: hasCollectors ? (high ? "Let's focus here now" : "Needs your attention") : "Looking good", statusColor: hasCollectors ? (high ? "#ef4444" : "#f59e0b") : "#22c55e", route: "/live-call" },
    { label: "What they sent you", status: d.pressureSources.length > 0 ? "Needs your attention" : "Looking good", statusColor: d.pressureSources.length > 0 ? "#f59e0b" : "#22c55e", route: "/documents" },
    { label: "Before you decide", status: d.behaviorPatterns.some(b => b.toLowerCase().includes("panic")) ? "Worth watching" : "Looking good", statusColor: d.behaviorPatterns.some(b => b.toLowerCase().includes("panic")) ? "#f97316" : "#22c55e", route: "/decisions" },
    { label: "Know your options", status: hasLegal ? "Let's focus here now" : d.fears.includes("Being sued") ? "Worth watching" : "Looking good", statusColor: hasLegal ? "#ef4444" : d.fears.includes("Being sued") ? "#f97316" : "#22c55e", route: "/legal-support" },
    { label: "Getting your life back", status: "Let's work on this next", statusColor: "#f59e0b", route: "/recovery" },
  ];
}

function deriveObservation(d: OnboardingData): string {
  const avoider = d.behaviorPatterns.some(b => b.toLowerCase().includes("avoid") || b.toLowerCase().includes("ignore"));
  const panicker = d.behaviorPatterns.some(b => b.toLowerCase().includes("panic") || b.toLowerCase().includes("agree quickly"));
  const shutsDown = d.behaviorPatterns.some(b => b.toLowerCase().includes("shut down"));
  const hasLegalFear = d.fears.includes("Being sued") || d.fears.includes("Wage garnishment");
  const ashamed = d.hardestThings.some(h => h.toLowerCase().includes("ashamed"));
  const hasStepByStep = d.supportStyle.some(s => s.toLowerCase().includes("step"));
  const hasFast = d.supportStyle.some(s => s.toLowerCase().includes("fast"));
  if (avoider && hasLegalFear) return "You carry two things at once: a tendency to avoid difficult conversations, and a fear of what happens if things escalate legally. Mina will focus on helping you understand your rights early — before avoiding feels like the only option.";
  if (avoider) return "You selected that pressure makes you step back from difficult conversations. Mina will help you prepare before the pressure arrives — so you can engage when you are ready, not when you are afraid.";
  if (panicker) return "You tend to agree to things quickly when under pressure. Mina will interrupt that pattern — giving you a phrase to pause the conversation before you commit to anything.";
  if (shutsDown) return "You shared that you tend to shut down when too many things arrive at once. Mina will keep every session focused on one thing only — nothing overwhelming, nothing unclear.";
  if (hasLegalFear) return "Legal consequences are your biggest fear. Mina will prioritize helping you understand what is real, what can wait, and when professional help is actually necessary.";
  if (ashamed) return "Carrying shame alongside debt pressure is exhausting. Mina will never judge. Every conversation here is private, and every step forward counts — no matter how small.";
  if (hasStepByStep) return "You asked for step-by-step guidance. That is how Mina will work with you — one clear action at a time, nothing rushed, nothing vague.";
  if (hasFast) return "You asked for direct answers. Mina will lead with what matters most and keep explanations short — unless you want to go deeper.";
  return "Mina has built a picture of how you think and respond under pressure. Every recommendation going forward will be shaped around your actual patterns — not a generic plan.";
}

function deriveMemoryCards(d: OnboardingData, main: string, fear: string, style: string, phase: CurrentPhase): MemoryCard[] {
  const avoider = d.behaviorPatterns.some(b => b.toLowerCase().includes("avoid") || b.toLowerCase().includes("ignore"));
  const multi = d.pressureSources.length > 1;
  return [
    { label: "What you're carrying", value: multi ? `${d.pressureSources.length} sources of pressure` : main,
      evolutionLabel: multi ? "Multiple sources tracked" : "Identified from your answers",
      coachingNote: multi ? "Mina has noted this across multiple answers." : "This shapes where Mina focuses first." },
    { label: "What worries you most", value: fear,
      evolutionLabel: avoider ? "Mina works around this" : "Pattern becoming clearer",
      coachingNote: "Mina has noticed this appears in multiple answers." },
    { label: "How you need support", value: style,
      evolutionLabel: "Shapes every response",
      coachingNote: "This shapes how Mina responds to you." },
    { label: "Where you are now", value: phase,
      evolutionLabel: "How far you have come",
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
    const em = deriveEmotional(raw);
    const coach = deriveCoach(raw);
    const nba = deriveNBA(raw);
    const journeyPhases = ["Stabilize", "Understand", "Protect", "Act", "Resolve", "Recover"];
    const currentJourneyIndex = Math.max(0, journeyPhases.indexOf(phase));
    const mainPressure = raw.pressureSources.length > 0
      ? raw.pressureSources.length === 1 ? raw.pressureSources[0] : `${raw.pressureSources.length} debt sources`
      : "General financial pressure";
    const fearPattern = raw.fears.length > 0 ? raw.fears[0] : "Managing uncertainty";
    const supportStyle = raw.supportStyle[0] ?? "Step-by-step guidance";
    const readiness = deriveReadiness(raw);
    const momentIndex = typeof Date !== "undefined" ? new Date().getDate() % HUMAN_MOMENTS.length : 0;
    return {
      firstName: "there",
      pressureState, pressureStateColor: STATE_COLOR[pressureState], currentPhase: phase,
      coachHeader: coach.header, coachLines: coach.lines, coachClosing: coach.closing, coachFocus: coach.focus,
      recommendation: nba.action, recommendedRoute: nba.route,
      nextBestAction: nba,
      recoveryReadiness: readiness, emotionalState: em.state, emotionalStateColor: em.color,
      memoryCards: deriveMemoryCards(raw, mainPressure, fearPattern, supportStyle, phase),
      pressureAreas: derivePressureAreas(raw),
      journeyPhases, currentJourneyIndex,
      journeyProgress: Math.round((currentJourneyIndex / (journeyPhases.length - 1)) * 100),
      nextMilestoneName: NEXT_MILESTONES[journeyPhases[currentJourneyIndex]] ?? "",
      behaviorObservation: deriveObservation(raw),
      sinceLastVisitItems: deriveSinceLastVisit(raw, readiness),
      humanMoment: HUMAN_MOMENTS[momentIndex],
    };
  }, [raw]);
}
