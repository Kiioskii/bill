import api from "@/api/api";
import type { CreateQuizPayload } from "../types/Quiz";

export const createQuiz = async (data: CreateQuizPayload) => {
  const response = await api.post("quizzes/create", data);
  return response.data;
};
