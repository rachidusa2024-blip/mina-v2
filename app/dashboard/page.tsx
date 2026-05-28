"use client";

import { useDashboardData } from "@/components/features/dashboard/useDashboardData";
import DashboardHeader from "@/components/features/dashboard/DashboardHeader";
import MinaInsightHero from "@/components/features/dashboard/sections/MinaInsightHero";
import TodaysNextMove from "@/components/features/dashboard/sections/TodaysNextMove";
import LiveCallCenter from "@/components/features/dashboard/sections/LiveCallCenter";
import MinaMemory from "@/components/features/dashboard/sections/MinaMemory";
import PressureMap from "@/components/features/dashboard/sections/PressureMap";
import Workspaces from "@/components/features/dashboard/sections/Workspaces";
import RecoveryJourney from "@/components/features/dashboard/sections/RecoveryJourney";
import MinaNoticed from "@/components/features/dashboard/sections/MinaNoticed";

export default function DashboardPage() {
  const data = useDashboardData();

  return (
    <div
      style={{
        background: "var(--bg-base)",
        minHeight: "100vh",
        // @ts-ignore
        "--bg-base": "#090D1A",
        "--bg-card": "#111827",
        "--text-prime": "#F0F4FF",
        "--text-muted": "#8892A4",
        "--teal": "#00C9A7",
        "--teal-dim": "rgba(0,201,167,0.1)",
        "--gold": "#C9A84C",
        "--border": "rgba(255,255,255,0.08)",
      } as React.CSSProperties}
    >
      <DashboardHeader firstName={data.firstName} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 flex flex-col gap-8">

        {/* 1. Mina Insight Hero */}
        <MinaInsightHero
          pressureState={data.pressureState}
          pressureStateColor={data.pressureStateColor}
          currentPhase={data.currentPhase}
          insightText={data.insightText}
          recommendation={data.recommendation}
          recommendedRoute={data.recommendedRoute}
        />

        {/* 2. Today's Next Move */}
        <TodaysNextMove
          label={data.nextMoveLabel}
          detail={data.nextMoveDetail}
          route={data.nextMoveRoute}
        />

        {/* 3. Live Call Center */}
        <LiveCallCenter />

        {/* 4. Mina Memory */}
        <MinaMemory
          mainPressure={data.mainPressure}
          fearPattern={data.fearPattern}
          supportStyle={data.supportStyle}
          currentPhaseName={data.currentPhaseName}
        />

        {/* 5. Pressure Map */}
        <PressureMap areas={data.pressureAreas} />

        {/* 6. Workspaces */}
        <Workspaces />

        {/* 7. Recovery Journey */}
        <RecoveryJourney
          phases={data.journeyPhases}
          currentIndex={data.currentJourneyIndex}
        />

        {/* 8. Mina Noticed */}
        <MinaNoticed observation={data.behaviorObservation} />

      </main>
    </div>
  );
}
