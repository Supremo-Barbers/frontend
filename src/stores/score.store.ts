import { create } from "zustand";
import { persist } from "zustand/middleware";
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

export const useScoreStore = create<ScoreState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "score-store",
    },
  ),
);
