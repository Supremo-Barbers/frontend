import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Enrollment, EnrollStudentRequest } from "../schemas/enrollment.schemas";
import { EnrollStudentRequestSchema } from "../schemas/enrollment.schemas";
import { useStudentStore } from "./student.store";

interface EnrollmentState {
  enrollments: Enrollment[];
  listEnrollments: (courseId: string) => Promise<Enrollment[]>;
  createEnrollment: (courseId: string, request: EnrollStudentRequest) => Promise<Enrollment>;
  deleteEnrollment: (id: string) => Promise<void>;
}

export const useEnrollmentStore = create<EnrollmentState>()(
  persist(
    (set, get) => ({
      enrollments: [],
      listEnrollments: async (courseId) => {
        return get().enrollments.filter((e) => e.courseId === courseId);
      },
      createEnrollment: async (courseId, request) => {
        const validatedData = EnrollStudentRequestSchema.parse(request);

        const students = useStudentStore.getState().students;
        const studentExists = students.some((s) => s.id === validatedData.studentId);
        if (!studentExists) {
          throw new Error("Student not found");
        }

        const newEnrollment: Enrollment = {
          id: crypto.randomUUID(),
          courseId,
          studentId: validatedData.studentId,
        };

        set((state) => ({ enrollments: [...state.enrollments, newEnrollment] }));
        return newEnrollment;
      },
      deleteEnrollment: async (id) => {
        const enrollment = get().enrollments.find((e) => e.id === id);
        if (!enrollment) return;

        const { useCategoryStore } = await import("./category.store");
        const { useAssessmentStore } = await import("./assessment.store");
        const { useScoreStore } = await import("./score.store");

        const categories = useCategoryStore.getState().categories.filter((c) => c.courseId === enrollment.courseId);
        const categoryIds = categories.map(c => c.id);
        const assessments = useAssessmentStore.getState().assessments.filter((a) => categoryIds.includes(a.categoryId));
        const assessmentIds = assessments.map(a => a.id);

        useScoreStore.setState((state) => ({
          scores: state.scores.filter(
            (s) => !(s.studentId === enrollment.studentId && assessmentIds.includes(s.assessmentId))
          )
        }));

        set((state) => ({ enrollments: state.enrollments.filter((e) => e.id !== id) }));
      },
    }),
    {
      name: "enrollment-store",
    },
  ),
);
