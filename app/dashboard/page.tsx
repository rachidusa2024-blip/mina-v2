"use client";

import { useDashboardData } from "@/components/features/dashboard/useDashboardData";
import DashboardHeader from "@/components/features/dashboard/DashboardHeader";
import DashboardHero from "@/components/features/dashboard/sections/DashboardHero";
import LiveCallCenter from "@/components/features/dashboard/sections/LiveCallCenter";
import RecommendedNextAction from "@/components/features/dashboard/sections/RecommendedNextAction";
import HowMinaUnderstandsYou from "@/components/features/dashboard/sections/HowMinaUnderstandsYou";
import RecoveryJourney from "@/components/features/dashboard/sections/RecoveryJourney";
import ToolsAvailableTo from "@/components/features/dashboard/sections/ToolsAvailableTo";

export default function DashboardPage() {
  const d = useDashboardData();
  return (
    <div style={{
      background: "var(--bg-base)", minHeight: "100vh",
      // @ts-ignore
      "--bg-base": "#090D1A", "--bg-card": "#111827",
      "--text-prime": "#F0F4FF", "--text-muted": "#8892A4",
      "--teal": "#00C9A7", "--teal-dim": "rgba(0,201,167,0.1)",
      "--gold": "#C9A84C", "--border": "rgba(255,255,255,0.08)",
    } as React.CSSProperties}>
      <DashboardHeader firstName={d.firstName} currentPhase={d.currentPhase} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 flex flex-col gap-10">
        <DashboardHero
          heroObservation={d.heroObservation} heroInsight={d.heroInsight}
          heroClosing={d.heroClosing} heroFocus={d.heroFocus}
          pressureState={d.pressureState} pressureStateColor={d.pressureStateColor}
          currentPhase={d.currentPhase}
        />
        <LiveCallCenter />
        <RecommendedNextAction {...d.primaryAction} />
        <HowMinaUnderstandsYou memoryCards={d.memoryCards} />
        <RecoveryJourney phases={d.journeyPhases} currentIndex={d.currentJourneyIndex}
          nextMilestoneName={d.nextMilestoneName} journeyProgress={d.journeyProgress} />
        <ToolsAvailableTo />
      </main>
    </div>
  );
}
