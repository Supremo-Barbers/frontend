import { useState, useEffect, useCallback } from "react";
import type { Category, CreateCategoryRequest } from "@/schemas/category.schemas";
import { listCategories, createCategory } from "@/api/category.api";
import { useBackendEngineStore } from "@/stores/backend-engine.store";
import { useCourseStore } from "@/stores/course.store";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const engine = useBackendEngineStore((state) => state.engine);
  const selectedCourse = useCourseStore((state) => state.selectedCourse);

  const fetchCategories = useCallback(async (): Promise<void> => {
    if (!selectedCourse) {
      setCategories([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await listCategories(selectedCourse.id);
      setCategories(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch categories");
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedCourse]);

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
      const newCategory = await createCategory(selectedCourse.id, categoryData);
      setCategories((prev) => [...prev, newCategory]);
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
