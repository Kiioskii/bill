import { useQuery } from "@tanstack/react-query";
import { getQuizDataRequest } from "../api/quizApi";

export const useGetQuizData = (quizId: string) => {
    const { data, error, isLoading } = useQuery({
        queryKey: ["get_quiz_data", quizId],
        queryFn: () => getQuizDataRequest(quizId),
        enabled: !!quizId,
    });
    return { data, error, isLoading };
};
