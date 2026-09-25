import { z } from "zod";

export const CategoryBreakdownSchema = z.object({
  categoryId: z.string().uuid(),
  categoryName: z.string(),
  weight: z.number(),
  pointsEarned: z.number(),
  totalPossible: z.number(),
  categoryPercentage: z.number(),
  weightedScore: z.number(),
});

export const StudentGradeSchema = z.object({
  studentId: z.string().uuid(),
  studentNumber: z.string(),
  fullName: z.string(),
  categoryBreakdown: z.array(CategoryBreakdownSchema),
  finalRawPercentage: z.number(),
  gradePoint: z.string(),
  academicRemark: z.string(),
});

export const CourseGradeSummarySchema = z.object({
  courseId: z.string().uuid(),
  courseCode: z.string(),
  engine: z.string(),
  gradingSystem: z.string(),
  students: z.array(StudentGradeSchema),
});

export type CategoryBreakdown = z.infer<typeof CategoryBreakdownSchema>;
export type StudentGrade = z.infer<typeof StudentGradeSchema>;
export type CourseGradeSummary = z.infer<typeof CourseGradeSummarySchema>;
