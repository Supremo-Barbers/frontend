import { useState, useCallback, useEffect } from 'react';
import type { CourseGradeSummary } from '@/schemas/grade.schemas';
import { getCourseGradeSummary as getCourseGradeSummaryApi } from '@/api/grade.api';
import { useCourseStore } from '@/stores/course.store';
import { useBackendEngineStore } from '@/stores/backend-engine.store';

export const useGrades = () => {
  const selectedCourse = useCourseStore((state) => state.selectedCourse);
  const engine = useBackendEngineStore((state) => state.engine);
  
  const [gradeSummary, setGradeSummary] = useState<CourseGradeSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = useCallback(async (): Promise<void> => {
    if (!selectedCourse) {
      setGradeSummary(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getCourseGradeSummaryApi(selectedCourse.id);
      setGradeSummary(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch course grades');
      }
      setGradeSummary(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCourse, engine]); 

  useEffect(() => {
    void fetchGrades();
  }, [fetchGrades]);

  return {
    gradeSummary,
    isLoading,
    error,
    refetchGrades: fetchGrades,
  };
};
