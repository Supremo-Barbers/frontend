import { create } from "zustand";
import type { RecordScoresRequest } from "../schemas/score.schemas";
import { RecordScoresRequestSchema } from "../schemas/score.schemas";

export interface ScoreEntry {
  assessmentId: string;
  studentId: string;
  score: number;
}

interface ScoreState {
  scores: ScoreEntry[];
  recordScores: (assessmentId: string, request: RecordScoresRequest) => Promise<void>;
}

export const useScoreStore = create<ScoreState>((set) => ({
  scores: [],
  recordScores: async (assessmentId, request) => {
    const validatedData = RecordScoresRequestSchema.parse(request);

    set((state) => {
      let currentScores = [...state.scores];

      for (const entry of validatedData.scores) {
        currentScores = currentScores.filter(
          (s) => !(s.assessmentId === assessmentId && s.studentId === entry.studentId),
        );
        currentScores.push({
          assessmentId,
          studentId: entry.studentId,
          score: entry.scoreObtained,
        });
      }

      return { scores: currentScores };
    });
  },
}));
