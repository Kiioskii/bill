import { useMutation } from "@tanstack/react-query";
import { addToFavoritesRequest } from "../api/quizApi";
import { showToast } from "@/lib/toast";

export const useAddToFavorites = () => {
    return useMutation({
        mutationKey: ["add_quiz_to_favorites"],
        mutationFn: (data: { quizId: string }) => addToFavoritesRequest(data),
        onSuccess: () => {
            showToast("Quiz added to favorites!", "success");
        },
        onError: (error) => {
            console.log("error", error);
            showToast(error.message || "Error occurred", "error");
        },
    });
};
