"use client";

import { useState, useCallback, useEffect } from "react";
import { OnboardingData, initialOnboardingData } from "./types";

const STORAGE_KEY = "mina_onboarding_v2";

function loadFromStorage(): OnboardingData {
  if (typeof window === "undefined") return initialOnboardingData;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialOnboardingData, ...JSON.parse(raw) };
  } catch {}
  return initialOnboardingData;
}

export function useOnboardingFlow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [lang, setLang] = useState<"en" | "es">("en");
  const [data, setData] = useState<OnboardingData>(loadFromStorage);

  // Persist to sessionStorage on every data change
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentSlide((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBack = useCallback(() => {
    if (currentSlide === 0) return;
    setDirection(-1);
    setCurrentSlide((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSlide]);

  const updateField = useCallback(
    <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Toggle an item in an array field, with optional max
  const toggleItem = useCallback(
    (
      key: "pressureSources" | "hardestThings" | "fears" | "behaviorPatterns" | "supportStyle",
      item: string,
      max?: number
    ) => {
      setData((prev) => {
        const arr = prev[key] as string[];
        if (arr.includes(item)) {
          return { ...prev, [key]: arr.filter((i) => i !== item) };
        }
        if (max !== undefined && arr.length >= max) return prev;
        return { ...prev, [key]: [...arr, item] };
      });
    },
    []
  );

  const clearStorage = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    currentSlide,
    direction,
    lang,
    setLang,
    data,
    goNext,
    goBack,
    updateField,
    toggleItem,
    clearStorage,
    isFirstSlide: currentSlide === 0,
    isAccountSlide: currentSlide === 8,
    progress: Math.min(currentSlide / 7, 1), // 0–1 over slides 0–7
  };
}
