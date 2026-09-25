import { apiClient } from "./client";
import type { Course, CreateCourseRequest } from "../schemas/course.schemas";
import { CourseSchema } from "../schemas/course.schemas";
import { z } from "zod";

export const listCourses = async (): Promise<Course[]> => {
  const response = await apiClient.get<unknown>("/courses");
  return z.array(CourseSchema).parse(response.data);
};

export const createCourse = async (course: CreateCourseRequest): Promise<Course> => {
  const response = await apiClient.post<unknown>("/courses", course);
  return CourseSchema.parse(response.data);
};
