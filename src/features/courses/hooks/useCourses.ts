import { useState, useEffect, useCallback } from "react";
import type { Course, CreateCourseRequest } from "@/schemas/course.schemas";
import { listCourses, createCourse } from "@/api/course.api";
import { useBackendEngineStore } from "@/stores/backend-engine.store";
import { useCourseStore } from "@/stores/course.store";

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const engine = useBackendEngineStore((state) => state.engine);
  const { selectedCourse, setSelectedCourse } = useCourseStore();

  const fetchCourses = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listCourses();
      setCourses(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch courses");
      }
    } finally {
      setIsLoading(false);
    }
  }, [engine]); 

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);

  const addCourse = async (courseData: CreateCourseRequest): Promise<Course> => {
    setIsLoading(true);
    setError(null);
    try {
      const newCourse = await createCourse(courseData);
      setCourses((prev) => [...prev, newCourse]);
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
