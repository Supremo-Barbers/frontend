import { apiClient } from "./client";
import type { RecordScoresRequest, RecordScoresResponse } from "../schemas/score.schemas";
import { RecordScoresResponseSchema } from "../schemas/score.schemas";

export const recordScores = async (
  assessmentId: string,
  request: RecordScoresRequest,
): Promise<RecordScoresResponse> => {
  const response = await apiClient.post<unknown>(`/assessments/${assessmentId}/scores`, request);
  return RecordScoresResponseSchema.parse(response.data);
};
