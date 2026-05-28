"use client";

import { useRouter } from "next/navigation";
import { useOnboardingFlow } from "@/components/features/onboarding/useOnboardingFlow";
import OnboardingShell from "@/components/features/onboarding/OnboardingShell";
import SlideTransition from "@/components/features/onboarding/SlideTransition";
import Slide1Welcome from "@/components/features/onboarding/slides/Slide1Welcome";
import Slide2Pressure from "@/components/features/onboarding/slides/Slide2Pressure";
import Slide3Hardest from "@/components/features/onboarding/slides/Slide3Hardest";
import Slide4Urgency from "@/components/features/onboarding/slides/Slide4Urgency";
import Slide5Fears from "@/components/features/onboarding/slides/Slide5Fears";
import Slide6Behavior from "@/components/features/onboarding/slides/Slide6Behavior";
import Slide7Support from "@/components/features/onboarding/slides/Slide7Support";
import Slide8Summary from "@/components/features/onboarding/slides/Slide8Summary";
import AccountCreation from "@/components/features/onboarding/AccountCreation";

// CSS variables are applied globally via globals.css
// Fonts loaded via layout.tsx

export default function OnboardingPage() {
  const router = useRouter();
  const {
    currentSlide,
    direction,
    lang,
    data,
    goNext,
    goBack,
    updateField,
    toggleItem,
    clearStorage,
    isFirstSlide,
    isAccountSlide,
    progress,
  } = useOnboardingFlow();

  const handleAccountComplete = (email: string) => {
    clearStorage();
    // Step 4: redirect to dashboard after Supabase auth
    router.push("/dashboard");
  };

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return <Slide1Welcome lang={lang} onNext={goNext} />;
      case 1:
        return (
          <Slide2Pressure
            lang={lang}
            selected={data.pressureSources}
            onToggle={(item) => toggleItem("pressureSources", item)}
            onNext={goNext}
          />
        );
      case 2:
        return (
          <Slide3Hardest
            lang={lang}
            selected={data.hardestThings}
            onToggle={(item) => toggleItem("hardestThings", item, 3)}
            onNext={goNext}
          />
        );
      case 3:
        return (
          <Slide4Urgency
            lang={lang}
            value={data.urgencyLevel}
            onChange={(v) => updateField("urgencyLevel", v)}
            onNext={goNext}
          />
        );
      case 4:
        return (
          <Slide5Fears
            lang={lang}
            selected={data.fears}
            onToggle={(item) => toggleItem("fears", item)}
            onNext={goNext}
          />
        );
      case 5:
        return (
          <Slide6Behavior
            lang={lang}
            selected={data.behaviorPatterns}
            onToggle={(item) => toggleItem("behaviorPatterns", item)}
            onNext={goNext}
          />
        );
      case 6:
        return (
          <Slide7Support
            lang={lang}
            selected={data.supportStyle}
            onToggle={(item) => toggleItem("supportStyle", item)}
            onNext={goNext}
          />
        );
      case 7:
        return <Slide8Summary lang={lang} data={data} onNext={goNext} />;
      case 8:
        return <AccountCreation lang={lang} onComplete={handleAccountComplete} />;
      default:
        return null;
    }
  };

  return (
    <OnboardingShell
      currentSlide={currentSlide}
      progress={progress}
      isFirstSlide={isFirstSlide}
      isAccountSlide={isAccountSlide}
      onBack={goBack}
    >
      <SlideTransition slideKey={currentSlide} direction={direction}>
        {renderSlide()}
      </SlideTransition>
    </OnboardingShell>
  );
}
