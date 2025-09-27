import api from "@/api/api";
import type { CreateQuizPayload } from "../types/Quiz";

export const createQuiz = async (data: CreateQuizPayload) => {
  console.log("data", data);
  const response = api.post("quizzes/create", data);
  return response;
};
