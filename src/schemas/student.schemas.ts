import { z } from "zod";

export const StudentSchema = z.object({
  id: z.string().uuid(),
  studentNumber: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
});

export const RegisterStudentRequestSchema = z.object({
  studentNumber: z.string().trim().min(1, "Student number is required"),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Must be a valid email"),
});

export type Student = z.infer<typeof StudentSchema>;
export type RegisterStudentRequest = z.infer<typeof RegisterStudentRequestSchema>;
