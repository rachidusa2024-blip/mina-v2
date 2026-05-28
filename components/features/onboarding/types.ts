export interface OnboardingData {
  pressureSources: string[];
  hardestThings: string[];    // max 3
  urgencyLevel: number;       // 1–5
  fears: string[];            // multiple
  behaviorPatterns: string[];
  supportStyle: string[];
}

export const TOTAL_SLIDES = 8; // slides 1–8; slide index 8 = account creation

export const initialOnboardingData: OnboardingData = {
  pressureSources: [],
  hardestThings: [],
  urgencyLevel: 3,
  fears: [],
  behaviorPatterns: [],
  supportStyle: [],
};
