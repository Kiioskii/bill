import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/lib/toast";
import { saveQuizResult } from "../api/quizApi";

export const useSaveQuizResult = () => {
  //   const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["save_quiz_result"],
    mutationFn: (data: { quizId: string; answers: any[] }) =>
      saveQuizResult(data),
    onSuccess: (_, variables) => {
      //   queryClient.invalidateQueries(["get_quiz_list", variables.quizId]);
    },
    onError: (error) => {
      console.log("error", error);
      showToast(error.message || "Error occurred", "error");
    },
  });
};
