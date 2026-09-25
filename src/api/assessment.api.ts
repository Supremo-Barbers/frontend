import { apiClient } from "./client";
import type { Assessment, CreateAssessmentRequest } from "../schemas/assessment.schemas";
import { AssessmentSchema } from "../schemas/assessment.schemas";

export const createAssessment = async (
  categoryId: string,
  assessment: CreateAssessmentRequest,
): Promise<Assessment> => {
  const response = await apiClient.post<unknown>(`/categories/${categoryId}/assessments`, assessment);
  return AssessmentSchema.parse(response.data);
};
