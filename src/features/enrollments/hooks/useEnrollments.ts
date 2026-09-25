import { useState, useCallback, useEffect } from "react";
import type { Enrollment, EnrollStudentRequest } from "@/schemas/enrollment.schemas";
import { getEnrollments as getEnrollmentsApi, enrollStudent as enrollStudentApi } from "@/api/enrollment.api";
import { useEnrollmentStore } from "@/stores/enrollment.store";
import { useCourseStore } from "@/stores/course.store";

export const useEnrollments = () => {
  const globalEnrollments = useEnrollmentStore((state) => state.enrollments);
  const addEnrollmentToStore = useEnrollmentStore((state) => state.addEnrollment);
  const selectedCourse = useCourseStore((state) => state.selectedCourse);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const courseEnrollments = selectedCourse ? globalEnrollments.filter((e) => e.courseId === selectedCourse.id) : [];

  const fetchEnrollments = useCallback(async (): Promise<void> => {
    if (!selectedCourse) return;

    setIsLoading(true);
    setError(null);
    try {
      await getEnrollmentsApi(selectedCourse.id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedCourse]);

  useEffect(() => {
    void fetchEnrollments();
  }, [fetchEnrollments]);

  const enrollStudent = async (data: EnrollStudentRequest): Promise<Enrollment> => {
    if (!selectedCourse) {
      throw new Error("No course selected");
    }

    const alreadyEnrolled = courseEnrollments.some((e) => e.studentId === data.studentId);
    if (alreadyEnrolled) {
      throw new Error("Student is already enrolled in this course.");
    }

    setIsLoading(true);
    setError(null);
    try {
      const newEnrollment = await enrollStudentApi(selectedCourse.id, data);
      addEnrollmentToStore({ ...newEnrollment, courseId: selectedCourse.id });
      return newEnrollment;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      const genericError = new Error("Failed to enroll student");
      setError(genericError.message);
      throw genericError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    enrollments: courseEnrollments,
    isLoading,
    error,
    enrollStudent,
  };
};
