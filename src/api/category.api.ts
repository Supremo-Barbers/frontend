import { apiClient } from "./client";
import type { Category, CreateCategoryRequest } from "../schemas/category.schemas";
import { CategorySchema } from "../schemas/category.schemas";
import { z } from "zod";

export const listCategories = async (courseId: string): Promise<Category[]> => {
  const response = await apiClient.get<unknown>(`/courses/${courseId}/categories`);
  return z.array(CategorySchema).parse(response.data);
};

export const createCategory = async (courseId: string, category: CreateCategoryRequest): Promise<Category> => {
  const response = await apiClient.post<unknown>(`/courses/${courseId}/categories`, category);
  return CategorySchema.parse(response.data);
};
