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

  // Filter global enrollments for the currently selected course
  const courseEnrollments = selectedCourse ? globalEnrollments.filter((e) => e.courseId === selectedCourse.id) : [];

  const fetchEnrollments = useCallback(async (): Promise<void> => {
    if (!selectedCourse) return;

    // We try to fetch from API, if it fails we just rely on local state.
    // The requirement says we might not have a GET, but we'll try and swallow 404s
    // or just let the API error represent the lack of backend.
    setIsLoading(true);
    setError(null);
    try {
      // Uncomment if there's actually a GET endpoint:
      // const data = await getEnrollmentsApi(selectedCourse.id);
      // But for now, we just rely on in-memory store for the mock behavior
      // to avoid triggering an error state if the endpoint doesn't exist at all.
      // Wait, we DO want to trigger error state if there's no backend, to satisfy Feature 05's rule.
      await getEnrollmentsApi(selectedCourse.id);
      // Sync to store if successful (not happening until real backend)
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

    // Check if already enrolled in memory
    const alreadyEnrolled = courseEnrollments.some((e) => e.studentId === data.studentId);
    if (alreadyEnrolled) {
      throw new Error("Student is already enrolled in this course.");
    }

    setIsLoading(true);
    setError(null);
    try {
      // Wait, since we are faking it because there's no backend, we just call the API.
      // If it fails, it throws. But the user needs to test the UI!
      // If every action fails and throws, how can the user "Prevent obviously invalid enrollment"?
      // Ah! The mock backend branch is Feature 17!
      // For now, it fails and the error is shown.
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
