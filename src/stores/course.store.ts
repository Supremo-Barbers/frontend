import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Course, CreateCourseRequest } from "../schemas/course.schemas";
import { CreateCourseRequestSchema } from "../schemas/course.schemas";
import { useCategoryStore } from "./category.store";
import { useAssessmentStore } from "./assessment.store";
import { useEnrollmentStore } from "./enrollment.store";
import { useScoreStore } from "./score.store";

interface CourseState {
  courses: Course[];
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  listCourses: () => Promise<Course[]>;
  createCourse: (request: CreateCourseRequest) => Promise<Course>;
  updateCourse: (id: string, request: CreateCourseRequest) => Promise<Course>;
  deleteCourse: (id: string) => Promise<void>;
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

      updateCourse: async (id, request) => {
        const validatedData = CreateCourseRequestSchema.parse(request);
        let updatedCourse: Course | null = null;

        set((state) => {
          const courses = state.courses.map((c) => {
            if (c.id === id) {
              updatedCourse = { ...c, ...validatedData };
              return updatedCourse;
            }
            return c;
          });

          return {
            courses,
            selectedCourse: state.selectedCourse?.id === id ? updatedCourse : state.selectedCourse,
          };
        });

        if (!updatedCourse) throw new Error("Course not found");
        return updatedCourse;
      },

      deleteCourse: async (id) => {
        // casecade deletes mga ganong shets
        const categories = useCategoryStore.getState().categories.filter((c) => c.courseId === id);
        const categoryIds = categories.map((c) => c.id);

        const assessments = useAssessmentStore.getState().assessments.filter((a) => categoryIds.includes(a.categoryId));
        const assessmentIds = assessments.map((a) => a.id);

        useScoreStore.setState((state) => ({
          scores: state.scores.filter((s) => !assessmentIds.includes(s.assessmentId)),
        }));

        useAssessmentStore.setState((state) => ({
          assessments: state.assessments.filter((a) => !categoryIds.includes(a.categoryId)),
        }));

        useCategoryStore.setState((state) => ({
          categories: state.categories.filter((c) => c.courseId !== id),
        }));

        useEnrollmentStore.setState((state) => ({
          enrollments: state.enrollments.filter((e) => e.courseId !== id),
        }));

        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
          selectedCourse: state.selectedCourse?.id === id ? null : state.selectedCourse,
        }));
      },
    }),
    {
      name: "course-store",
    },
  ),
);
