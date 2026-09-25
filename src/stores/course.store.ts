import { create } from "zustand";
import type { Course } from "../schemas/course.schemas";

interface CourseState {
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  selectedCourse: null,
  setSelectedCourse: (course) => set({ selectedCourse: course }),
}));
