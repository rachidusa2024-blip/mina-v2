"use client";

import { useDashboardData } from "@/components/features/dashboard/useDashboardData";
import DashboardHeader from "@/components/features/dashboard/DashboardHeader";
import MinaInsightHero from "@/components/features/dashboard/sections/MinaInsightHero";
import NextBestAction from "@/components/features/dashboard/sections/NextBestAction";
import RecoveryReadiness from "@/components/features/dashboard/sections/RecoveryReadiness";
import LiveCallCenter from "@/components/features/dashboard/sections/LiveCallCenter";
import MinaMemory from "@/components/features/dashboard/sections/MinaMemory";
import PressureMap from "@/components/features/dashboard/sections/PressureMap";
import Workspaces from "@/components/features/dashboard/sections/Workspaces";
import RecoveryJourney from "@/components/features/dashboard/sections/RecoveryJourney";
import MinaNoticed from "@/components/features/dashboard/sections/MinaNoticed";

export default function DashboardPage() {
  const d = useDashboardData();
  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh",
      // @ts-ignore
      "--bg-base": "#090D1A", "--bg-card": "#111827",
      "--text-prime": "#F0F4FF", "--text-muted": "#8892A4",
      "--teal": "#00C9A7", "--teal-dim": "rgba(0,201,167,0.1)",
      "--gold": "#C9A84C", "--border": "rgba(255,255,255,0.08)",
    } as React.CSSProperties}>
      <DashboardHeader firstName={d.firstName} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 flex flex-col gap-8">
        <MinaInsightHero
          pressureState={d.pressureState} pressureStateColor={d.pressureStateColor}
          currentPhase={d.currentPhase} coachHeader={d.coachHeader}
          coachLines={d.coachLines} coachClosing={d.coachClosing}
          coachFocus={d.coachFocus} confidenceScore={0}
          recommendation={d.recommendation} recommendedRoute={d.recommendedRoute}
        />
        <NextBestAction {...d.nextBestAction} />
        <RecoveryReadiness score={d.recoveryReadiness} emotionalState={d.emotionalState} emotionalStateColor={d.emotionalStateColor} />
        <LiveCallCenter />
        <MinaMemory memoryCards={d.memoryCards} />
        <PressureMap areas={d.pressureAreas} />
        <Workspaces />
        <RecoveryJourney phases={d.journeyPhases} currentIndex={d.currentJourneyIndex} nextMilestoneName={d.nextMilestoneName} journeyProgress={d.journeyProgress} />
        <MinaNoticed observation={d.behaviorObservation} />
      </main>
    </div>
  );
}
