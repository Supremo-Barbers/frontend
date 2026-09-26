import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Assessment, CreateAssessmentRequest } from "../schemas/assessment.schemas";
import { CreateAssessmentRequestSchema } from "../schemas/assessment.schemas";

interface AssessmentState {
  assessments: Assessment[];
  createAssessment: (categoryId: string, request: CreateAssessmentRequest) => Promise<Assessment>;
  updateAssessment: (id: string, request: CreateAssessmentRequest) => Promise<Assessment>;
  deleteAssessment: (id: string) => Promise<void>;
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
      updateAssessment: async (id, request) => {
        const validatedData = CreateAssessmentRequestSchema.parse(request);
        let updatedAssessment: Assessment | null = null;

        set((state) => {
          const assessments = state.assessments.map((a) => {
            if (a.id === id) {
              updatedAssessment = { ...a, ...validatedData };
              return updatedAssessment;
            }
            return a;
          });
          return { assessments };
        });

        if (!updatedAssessment) throw new Error("Assessment not found");
        return updatedAssessment;
      },
      deleteAssessment: async (id) => {
        const { useScoreStore } = await import("./score.store");

        useScoreStore.setState((state) => ({
          scores: state.scores.filter((s) => s.assessmentId !== id),
        }));

        set((state) => ({
          assessments: state.assessments.filter((a) => a.id !== id),
        }));
      },
    }),
    {
      name: "assessment-store",
    },
  ),
);
