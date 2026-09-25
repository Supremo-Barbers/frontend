import { z } from "zod";

export const AssessmentSchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string().uuid(),
  title: z.string(),
  maxScore: z.number().positive(),
});

export const CreateAssessmentRequestSchema = z.object({
  title: z.string().trim().min(1, "Assessment title is required"),
  maxScore: z.number().positive("Maximum score must be greater than 0"),
});

export type Assessment = z.infer<typeof AssessmentSchema>;
export type CreateAssessmentRequest = z.infer<typeof CreateAssessmentRequestSchema>;
