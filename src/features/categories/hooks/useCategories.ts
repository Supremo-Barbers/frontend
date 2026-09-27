import React, { useState, useEffect, useCallback } from "react";
import type { Category, CreateCategoryRequest } from "@/schemas/category.schemas";
import { useCourseStore } from "@/stores/course.store";
import { useCategoryStore } from "@/stores/category.store";

export const useCategories = () => {
  const selectedCourse = useCourseStore((state) => state.selectedCourse);
  const globalCategories = useCategoryStore((state) => state.categories);
  const categories = React.useMemo(() => {
    return selectedCourse ? globalCategories.filter((c) => c.courseId === selectedCourse.id) : [];
  }, [globalCategories, selectedCourse]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { listCategories, createCategory: createCategoryAction } = useCategoryStore();

  const fetchCategories = useCallback(async (): Promise<void> => {
    if (!selectedCourse) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await listCategories(selectedCourse.id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch categories");
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedCourse, listCategories]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const validateWeight = (weight: number, excludeCategoryId?: string) => {
    const currentTotal = categories.filter((c) => c.id !== excludeCategoryId).reduce((sum, c) => sum + c.weight, 0);
    if (currentTotal + weight > 1.0) {
      throw new Error(`Total weight cannot exceed 100%. Current total is ${Math.round(currentTotal * 100)}%.`);
    }
  };

  const addCategory = async (categoryData: CreateCategoryRequest): Promise<Category> => {
    if (!selectedCourse) {
      throw new Error("No course selected");
    }

    setIsLoading(true);
    setError(null);
    try {
      validateWeight(categoryData.weight);
      const newCategory = await createCategoryAction(selectedCourse.id, categoryData);
      return newCategory;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      const genericError = new Error("Failed to create category");
      setError(genericError.message);
      throw genericError;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (id: string, categoryData: CreateCategoryRequest): Promise<Category> => {
    setIsLoading(true);
    setError(null);
    try {
      validateWeight(categoryData.weight, id);
      const updatedCategory = await useCategoryStore.getState().updateCategory(id, categoryData);
      return updatedCategory;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      const genericError = new Error("Failed to update category");
      setError(genericError.message);
      throw genericError;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await useCategoryStore.getState().deleteCategory(id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      const genericError = new Error("Failed to delete category");
      setError(genericError.message);
      throw genericError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categories,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
  };
};
