import React, { useState, useCallback, useEffect } from "react";
import type { Enrollment, EnrollStudentRequest } from "@/schemas/enrollment.schemas";
import { useCourseStore } from "@/stores/course.store";
import { useEnrollmentStore } from "@/stores/enrollment.store";

export const useEnrollments = () => {
  const selectedCourse = useCourseStore((state) => state.selectedCourse);
  const globalEnrollments = useEnrollmentStore((state) => state.enrollments);
  const { listEnrollments, createEnrollment: createEnrollmentAction } = useEnrollmentStore();

  const enrollments = React.useMemo(() => {
    return selectedCourse ? globalEnrollments.filter(e => e.courseId === selectedCourse.id) : [];
  }, [globalEnrollments, selectedCourse]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = useCallback(async (): Promise<void> => {
    if (!selectedCourse) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await listEnrollments(selectedCourse.id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedCourse, listEnrollments]);

  useEffect(() => {
    void fetchEnrollments();
  }, [fetchEnrollments]);

  const enrollStudent = async (data: EnrollStudentRequest): Promise<Enrollment> => {
    if (!selectedCourse) {
      throw new Error("No course selected");
    }

    const alreadyEnrolled = enrollments.some((e) => e.studentId === data.studentId);
    if (alreadyEnrolled) {
      throw new Error("Student is already enrolled in this course.");
    }

    setIsLoading(true);
    setError(null);
    try {
      const newEnrollment = await createEnrollmentAction(selectedCourse.id, data);
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

  const unenrollStudent = async (enrollmentId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await useEnrollmentStore.getState().deleteEnrollment(enrollmentId);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      const genericError = new Error("Failed to unenroll student");
      setError(genericError.message);
      throw genericError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    enrollments,
    isLoading,
    error,
    enrollStudent,
    unenrollStudent,
  };
};
