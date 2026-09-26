import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, CreateCategoryRequest } from "../schemas/category.schemas";
import { CreateCategoryRequestSchema } from "../schemas/category.schemas";

interface CategoryState {
  categories: Category[];
  listCategories: (courseId: string) => Promise<Category[]>;
  createCategory: (courseId: string, request: CreateCategoryRequest) => Promise<Category>;
  updateCategory: (id: string, request: CreateCategoryRequest) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],

      listCategories: async (courseId) => {
        return get().categories.filter((c) => c.courseId === courseId);
      },

      createCategory: async (courseId, request) => {
        const validatedData = CreateCategoryRequestSchema.parse(request);
        const newCategory: Category = {
          id: crypto.randomUUID(),
          courseId,
          ...validatedData,
        };
        set((state) => ({ categories: [...state.categories, newCategory] }));
        return newCategory;
      },

      updateCategory: async (id, request) => {
        const validatedData = CreateCategoryRequestSchema.parse(request);
        let updatedCategory: Category | null = null;

        set((state) => {
          const categories = state.categories.map((c) => {
            if (c.id === id) {
              updatedCategory = { ...c, ...validatedData };
              return updatedCategory;
            }
            return c;
          });
          return { categories };
        });

        if (!updatedCategory) throw new Error("Category not found");
        return updatedCategory;
      },

      deleteCategory: async (id) => {
        const { useAssessmentStore } = await import("./assessment.store");
        const { useScoreStore } = await import("./score.store");

        const assessmentsToDelete = useAssessmentStore.getState().assessments.filter((a) => a.categoryId === id);
        const assessmentIdsToDelete = assessmentsToDelete.map((a) => a.id);

        useScoreStore.setState((state) => ({
          scores: state.scores.filter((s) => !assessmentIdsToDelete.includes(s.assessmentId)),
        }));

        useAssessmentStore.setState((state) => ({
          assessments: state.assessments.filter((a) => a.categoryId !== id),
        }));

        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },
    }),
    {
      name: "category-store",
    },
  ),
);
