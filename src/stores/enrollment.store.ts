import { create } from "zustand";
import type { Enrollment } from "../schemas/enrollment.schemas";

interface EnrollmentState {
  enrollments: Enrollment[];
  addEnrollment: (enrollment: Enrollment) => void;
}

export const useEnrollmentStore = create<EnrollmentState>((set) => ({
  enrollments: [],
  addEnrollment: (enrollment) => set((state) => ({ enrollments: [...state.enrollments, enrollment] })),
}));
