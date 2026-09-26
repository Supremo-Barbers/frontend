import { create } from "zustand";
import type { Category, CreateCategoryRequest } from "../schemas/category.schemas";
import { CreateCategoryRequestSchema } from "../schemas/category.schemas";

interface CategoryState {
  categories: Category[];
  listCategories: (courseId: string) => Promise<Category[]>;
  createCategory: (courseId: string, request: CreateCategoryRequest) => Promise<Category>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
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
}));
