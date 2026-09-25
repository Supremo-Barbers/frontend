import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string().uuid(),
  courseId: z.string().uuid(),
  name: z.string(),
  weight: z.number().positive().lte(1),
});

export const CreateCategoryRequestSchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),
  weight: z.number().positive("Weight must be greater than 0").lte(1, "Weight cannot exceed 1.0"),
});

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategoryRequest = z.infer<typeof CreateCategoryRequestSchema>;
