import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeQuizProgressRequest } from "../api/quizApi";
import { showToast } from "@/lib/toast";

export const useMakeQuizProgress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["make_quiz_progress"],
        mutationFn: (data: { quizId: string; question: number }) => makeQuizProgressRequest(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(["get_quiz_list", variables.quizId]);
        },
        onError: (error) => {
            console.log("error", error);
            showToast(error.message || "Error occurred", "error");
        },
    });
};
