import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Enrollment, EnrollStudentRequest } from "../schemas/enrollment.schemas";
import { EnrollStudentRequestSchema } from "../schemas/enrollment.schemas";
import { useStudentStore } from "./student.store";

interface EnrollmentState {
  enrollments: Enrollment[];
  listEnrollments: (courseId: string) => Promise<Enrollment[]>;
  createEnrollment: (courseId: string, request: EnrollStudentRequest) => Promise<Enrollment>;
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
    }),
    {
      name: "enrollment-store",
    },
  ),
);
