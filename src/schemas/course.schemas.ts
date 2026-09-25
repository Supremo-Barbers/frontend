import { z } from "zod";

export const CourseSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  title: z.string(),
  term: z.string(),
  createdAt: z.string().datetime(),
});

export const CreateCourseRequestSchema = z.object({
  code: z.string().trim().min(1, "Course code is required"),
  title: z.string().trim().min(1, "Course title is required"),
  term: z.string().trim().min(1, "Academic term is required"),
});

export type Course = z.infer<typeof CourseSchema>;
export type CreateCourseRequest = z.infer<typeof CreateCourseRequestSchema>;
