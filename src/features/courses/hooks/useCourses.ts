import { useState, useEffect, useCallback } from "react";
import type { Course, CreateCourseRequest } from "@/schemas/course.schemas";
import { useCourseStore } from "@/stores/course.store";
import { useBackendEngineStore } from "@/stores/backend-engine.store";

export const useCourses = () => {
  const courses = useCourseStore((state) => state.courses);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const engine = useBackendEngineStore((state) => state.engine);
  const { selectedCourse, setSelectedCourse, listCourses, createCourse: createCourseAction } = useCourseStore();

  const fetchCourses = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await listCourses();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch courses");
      }
    } finally {
      setIsLoading(false);
    }
  }, [listCourses]); 

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses, engine]);

  const addCourse = async (courseData: CreateCourseRequest): Promise<Course> => {
    setIsLoading(true);
    setError(null);
    try {
      const newCourse = await createCourseAction(courseData);
      return newCourse;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      const genericError = new Error("Failed to create course");
      setError(genericError.message);
      throw genericError;
    } finally {
      setIsLoading(false);
    }
  };

  const selectCourse = (courseId: string): void => {
    const course = courses.find((c) => c.id === courseId) || null;
    setSelectedCourse(course);
  };

  return {
    courses,
    isLoading,
    error,
    addCourse,
    fetchCourses,
    selectedCourse,
    selectCourse,
  };
};
