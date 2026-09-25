import { apiClient } from "./client";
import type { Enrollment, EnrollStudentRequest } from "../schemas/enrollment.schemas";
import { EnrollmentSchema } from "../schemas/enrollment.schemas";
import { z } from "zod";

export const getEnrollments = async (courseId: string): Promise<Enrollment[]> => {
  const response = await apiClient.get<unknown>(`/courses/${courseId}/enrollments`);
  return z.array(EnrollmentSchema).parse(response.data);
};

export const enrollStudent = async (courseId: string, request: EnrollStudentRequest): Promise<Enrollment> => {
  const response = await apiClient.post<unknown>(`/courses/${courseId}/enrollments`, request);
  return EnrollmentSchema.parse(response.data);
};
