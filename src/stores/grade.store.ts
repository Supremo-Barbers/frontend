import { create } from "zustand";
import type { CourseGradeSummary } from "../schemas/grade.schemas";
import { useCourseStore } from "./course.store";
import { useCategoryStore } from "./category.store";
import { useEnrollmentStore } from "./enrollment.store";
import { useAssessmentStore } from "./assessment.store";
import { useStudentStore } from "./student.store";
import { useScoreStore } from "./score.store";

interface GradeState {
  getCourseGrades: (courseId: string) => Promise<CourseGradeSummary>;
}

export const useGradeStore = create<GradeState>(() => ({
  getCourseGrades: async (courseId) => {
    const course = useCourseStore.getState().courses.find((c) => c.id === courseId);
    const categories = useCategoryStore.getState().categories.filter((c) => c.courseId === courseId);
    const enrollments = useEnrollmentStore.getState().enrollments.filter((e) => e.courseId === courseId);

    const students = useStudentStore.getState().students;
    const allAssessments = useAssessmentStore.getState().assessments;
    const allScores = useScoreStore.getState().scores;

    const studentGrades = enrollments.map((enrollment) => {
      const student = students.find((s) => s.id === enrollment.studentId)!;
      let totalCourseScore = 0;

      const categoryBreakdown = categories.map((category) => {
        const catAssessments = allAssessments.filter((a) => a.categoryId === category.id);
        let totalPossible = 0;
        let totalObtained = 0;

        catAssessments.forEach((ass) => {
          totalPossible += ass.maxScore;
          const scoreEntry = allScores.find((s) => s.assessmentId === ass.id && s.studentId === student.id);
          if (scoreEntry) {
            totalObtained += scoreEntry.score;
          }
        });

        const rawPercentage = totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0;
        const weightedScore = (rawPercentage / 100) * category.weight * 100;
        totalCourseScore += weightedScore;

        return {
          categoryId: category.id,
          categoryName: category.name,
          weight: category.weight,
          pointsEarned: totalObtained,
          totalPossible,
          categoryPercentage: rawPercentage,
          weightedScore,
        };
      });

      let finalNuGrade = 0.0;
      let isFailed = false;

      if (totalCourseScore >= 96) finalNuGrade = 4.0;
      else if (totalCourseScore >= 90) finalNuGrade = 3.5;
      else if (totalCourseScore >= 84) finalNuGrade = 3.0;
      else if (totalCourseScore >= 78) finalNuGrade = 2.5;
      else if (totalCourseScore >= 72) finalNuGrade = 2.0;
      else if (totalCourseScore >= 66) finalNuGrade = 1.5;
      else if (totalCourseScore >= 60) finalNuGrade = 1.0;
      else {
        finalNuGrade = 0.0;
        isFailed = true;
      }

      return {
        studentId: student.id,
        studentNumber: student.studentNumber,
        fullName: `${student.lastName}, ${student.firstName}`,
        categoryBreakdown,
        finalRawPercentage: totalCourseScore,
        gradePoint: isFailed ? "R" : finalNuGrade.toFixed(1),
        academicRemark: isFailed ? "FAILED" : "PASSED",
      };
    });

    return {
      courseId,
      courseCode: course?.code || "UNKNOWN",
      engine: "ZUSTAND_SIMULATION",
      gradingSystem: "STANDARD_0_BASED",
      students: studentGrades,
    };
  },
}));
