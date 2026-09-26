import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Course, CreateCourseRequest } from "../schemas/course.schemas";
import { CreateCourseRequestSchema } from "../schemas/course.schemas";

interface CourseState {
  courses: Course[];
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  listCourses: () => Promise<Course[]>;
  createCourse: (request: CreateCourseRequest) => Promise<Course>;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courses: [],
      selectedCourse: null,
      setSelectedCourse: (course) => set({ selectedCourse: course }),

      listCourses: async () => {
        return get().courses;
      },

      createCourse: async (request) => {
        const validatedData = CreateCourseRequestSchema.parse(request);

        const newCourse: Course = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          ...validatedData,
        };

        set((state) => ({ courses: [...state.courses, newCourse] }));
        return newCourse;
      },
    }),
    {
      name: "course-store",
    },
  ),
);
