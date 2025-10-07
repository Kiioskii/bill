import { useMutation } from "@tanstack/react-query";
import { toggleFavoriteRequest } from "../api/quizApi";
import { showToast } from "@/lib/toast";

export const useToggleFavorite = () => {
    return useMutation({
        mutationKey: ["add_quiz_to_favorites"],
        mutationFn: (data: { quizId: string; isFavorite: boolean }) => toggleFavoriteRequest(data),
        onSuccess: () => {
            showToast("Toggle favorite!", "success");
        },
        onError: (error) => {
            console.log("error", error);
            showToast(error.message || "Error occurred", "error");
        },
    });
};
