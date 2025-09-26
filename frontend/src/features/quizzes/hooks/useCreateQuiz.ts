import { useMutation } from "@tanstack/react-query";
import type { CreateQuizPayload } from "../types/Quiz";
import { showToast } from "@/lib/toast";
import { createQuiz } from "../api/quizApi";

export const useCreateQuiz = () => {
  return useMutation({
    mutationKey: ["create_quiz"],
    mutationFn: (data: CreateQuizPayload) => createQuiz(data),
    onSuccess: () => {
      showToast("Quiz created successfully!", "success");
    },
    onError: (error) => {
      showToast(error.message || "Create quiz failed", "error");
    },
  });
};
