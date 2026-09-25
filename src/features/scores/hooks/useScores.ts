import { useState } from "react";
import type { RecordScoresRequest, RecordScoresResponse } from "@/schemas/score.schemas";
import { recordScores as recordScoresApi } from "@/api/score.api";
import { useGradingSessionStore } from "@/stores/grading-session.store";

export const useScores = () => {
  const activeAssessment = useGradingSessionStore((state) => state.activeAssessment);
  const setActiveAssessment = useGradingSessionStore((state) => state.setActiveAssessment);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submitScores = async (data: RecordScoresRequest): Promise<RecordScoresResponse> => {
    if (!activeAssessment) {
      throw new Error("No assessment selected for grading");
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await recordScoresApi(activeAssessment.id, data);
      return result;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      const genericError = new Error("Failed to record scores");
      setError(genericError.message);
      throw genericError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activeAssessment,
    setActiveAssessment,
    isLoading,
    error,
    submitScores,
  };
};
