import { apiClient } from "./client";
import type { CourseGradeSummary } from "../schemas/grade.schemas";
import { CourseGradeSummarySchema } from "../schemas/grade.schemas";

export const getCourseGradeSummary = async (courseId: string): Promise<CourseGradeSummary> => {
  const response = await apiClient.get<unknown>(`/courses/${courseId}/grades`);
  return CourseGradeSummarySchema.parse(response.data);
};
