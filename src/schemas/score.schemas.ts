import { z } from "zod";

export const ScoreEntrySchema = z.object({
  studentId: z.string().uuid(),
  scoreObtained: z.number().min(0, "Score cannot be negative"),
});

export const RecordScoresRequestSchema = z.object({
  scores: z.array(ScoreEntrySchema),
});

export const RecordScoresResponseSchema = z.object({
  assessmentId: z.string().uuid(),
  recordsUpdated: z.number().nonnegative(),
});

export type ScoreEntry = z.infer<typeof ScoreEntrySchema>;
export type RecordScoresRequest = z.infer<typeof RecordScoresRequestSchema>;
export type RecordScoresResponse = z.infer<typeof RecordScoresResponseSchema>;
