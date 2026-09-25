import { z } from "zod";

export const EnrollmentSchema = z.object({
  id: z.string().uuid().optional(),
  studentId: z.string().uuid(),
  courseId: z.string().uuid().optional(),
});

export const EnrollStudentRequestSchema = z.object({
  studentId: z.string().uuid("A valid student must be selected"),
});

export type Enrollment = z.infer<typeof EnrollmentSchema>;
export type EnrollStudentRequest = z.infer<typeof EnrollStudentRequestSchema>;
