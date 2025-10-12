import { useMutation } from "@tanstack/react-query";
import { unsetFavoriteQuestion } from "../api/quizApi";
import { showToast } from "@/lib/toast";

export const useUnsetFavoriteQuestion = () => {
    // const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["set_favorite_question"],
        mutationFn: (data: { quizId: string; question: number }) => unsetFavoriteQuestion(data),
        onSuccess: (_, variables) => {
            // queryClient.invalidateQueries(["set_favorite_question", variables.quizId]);
        },
        onError: (error) => {
            console.log("error", error);
            showToast(error.message || "Error occurred", "error");
        },
    });
};
