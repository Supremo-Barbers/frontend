import { z } from 'zod';

export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  path: z.string(),
  status: z.number(),
  timestamp: z.string().datetime(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
