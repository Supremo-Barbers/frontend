import { create } from "zustand";
import type { Assessment } from "../schemas/assessment.schemas";

interface AssessmentState {
  assessments: Assessment[];
  addAssessment: (assessment: Assessment) => void;
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  assessments: [],
  addAssessment: (assessment) => set((state) => ({ assessments: [...state.assessments, assessment] })),
}));
