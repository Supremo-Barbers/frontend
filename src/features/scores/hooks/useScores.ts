import { useState } from "react";
import type { RecordScoresRequest, RecordScoresResponse } from "@/schemas/score.schemas";
import { useGradingSessionStore } from "@/stores/grading-session.store";
import { useScoreStore } from "@/stores/score.store";

export const useScores = () => {
  const activeAssessment = useGradingSessionStore((state) => state.activeAssessment);
  const setActiveAssessment = useGradingSessionStore((state) => state.setActiveAssessment);
  const { recordScores: recordScoresAction } = useScoreStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submitScores = async (data: RecordScoresRequest): Promise<RecordScoresResponse> => {
    if (!activeAssessment) {
      throw new Error("No assessment selected for grading");
    }

    setIsLoading(true);
    setError(null);
    try {
      await recordScoresAction(activeAssessment.id, data);
      return { assessmentId: activeAssessment.id, recordsUpdated: data.scores.length };
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
