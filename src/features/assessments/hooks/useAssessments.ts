import { useState, useMemo } from "react";
import type { Assessment, CreateAssessmentRequest } from "@/schemas/assessment.schemas";
import { useAssessmentStore } from "@/stores/assessment.store";

import type { Category } from "@/schemas/category.schemas";

export const useAssessments = (courseCategories: Category[] = []) => {
  const globalAssessments = useAssessmentStore((state) => state.assessments);
  const { createAssessment: createAssessmentAction } = useAssessmentStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeAssessments = useMemo(() => {
    const categoryIds = new Set(courseCategories.map((c) => c.id));
    return globalAssessments.filter((a) => categoryIds.has(a.categoryId));
  }, [globalAssessments, courseCategories]);

  const addAssessment = async (categoryId: string, data: CreateAssessmentRequest): Promise<Assessment> => {
    setIsLoading(true);
    setError(null);
    try {
      const newAssessment = await createAssessmentAction(categoryId, data);
      return newAssessment;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      const genericError = new Error("Failed to create assessment");
      setError(genericError.message);
      throw genericError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    assessments: activeAssessments,
    isLoading,
    error,
    addAssessment,
  };
};
