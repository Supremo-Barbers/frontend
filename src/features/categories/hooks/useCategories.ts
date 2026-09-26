import React, { useState, useEffect, useCallback } from "react";
import type { Category, CreateCategoryRequest } from "@/schemas/category.schemas";
import { useCourseStore } from "@/stores/course.store";
import { useBackendEngineStore } from "@/stores/backend-engine.store";
import { useCategoryStore } from "@/stores/category.store";

export const useCategories = () => {
  const selectedCourse = useCourseStore((state) => state.selectedCourse);
  const globalCategories = useCategoryStore((state) => state.categories);
  const categories = React.useMemo(() => {
    return selectedCourse ? globalCategories.filter((c) => c.courseId === selectedCourse.id) : [];
  }, [globalCategories, selectedCourse]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const engine = useBackendEngineStore((state) => state.engine);
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
  }, [fetchCategories, engine]);

  const addCategory = async (categoryData: CreateCategoryRequest): Promise<Category> => {
    if (!selectedCourse) {
      throw new Error("No course selected");
    }

    setIsLoading(true);
    setError(null);
    try {
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

  return {
    categories,
    isLoading,
    error,
    addCategory,
    fetchCategories,
  };
};
