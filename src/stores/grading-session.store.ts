import { create } from "zustand";
import type { Assessment } from "../schemas/assessment.schemas";

interface GradingSessionState {
  activeAssessment: Assessment | null;
  setActiveAssessment: (assessment: Assessment | null) => void;
}

export const useGradingSessionStore = create<GradingSessionState>((set) => ({
  activeAssessment: null,
  setActiveAssessment: (assessment) => set({ activeAssessment: assessment }),
}));
