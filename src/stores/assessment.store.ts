import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Assessment, CreateAssessmentRequest } from "../schemas/assessment.schemas";
import { CreateAssessmentRequestSchema } from "../schemas/assessment.schemas";

interface AssessmentState {
  assessments: Assessment[];
  createAssessment: (categoryId: string, request: CreateAssessmentRequest) => Promise<Assessment>;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      assessments: [],
      createAssessment: async (categoryId, request) => {
        const validatedData = CreateAssessmentRequestSchema.parse(request);
        const newAssessment: Assessment = {
          id: crypto.randomUUID(),
          categoryId,
          ...validatedData,
        };
        set((state) => ({ assessments: [...state.assessments, newAssessment] }));
        return newAssessment;
      },
    }),
    {
      name: "assessment-store",
    },
  ),
);
