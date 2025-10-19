import { useQuery } from "@tanstack/react-query";
import { getQuizDataRequest } from "../api/quizApi";

export const useGetQuizData = (quizId: string) => {
  console.log("1111");
  const { data, error, isLoading } = useQuery({
    queryKey: ["get_quiz_data", quizId],
    queryFn: () => getQuizDataRequest(quizId),
    enabled: !!quizId,
    staleTime: 1000 * 60 * 10, // dane ważne przez 10 minut
    refetchOnMount: false, // nie pobiera ponownie przy montowaniu
    refetchOnWindowFocus: false, // nie pobiera po przełączeniu karty
    refetchOnReconnect: false, // nie pobiera po odzyskaniu połączenia
  });
  return { data, error, isLoading };
};
