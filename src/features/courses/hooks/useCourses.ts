import { useState, useEffect, useCallback } from "react";
import type { Course, CreateCourseRequest } from "@/schemas/course.schemas";
import { useCourseStore } from "@/stores/course.store";
export const useCourses = () => {
  const courses = useCourseStore((state) => state.courses);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    selectedCourse,
    setSelectedCourse,
    listCourses,
    createCourse: createCourseAction,
    updateCourse: updateCourseAction,
    deleteCourse: deleteCourseAction,
  } = useCourseStore();

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
  }, [fetchCourses]);

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

  const updateCourse = async (id: string, courseData: CreateCourseRequest): Promise<Course> => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCourse = await updateCourseAction(id, courseData);
      return updatedCourse;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      const genericError = new Error("Failed to update course");
      setError(genericError.message);
      throw genericError;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCourse = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteCourseAction(id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      const genericError = new Error("Failed to delete course");
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
    updateCourse,
    deleteCourse,
    fetchCourses,
    selectedCourse,
    selectCourse,
  };
};
