import { useQuery } from "@tanstack/react-query";
import { listQuiz } from "../api/quizApi";

export const useListQuiz = () => {
  return useQuery({
    queryKey: ["get_quiz_list"],
    queryFn: () => listQuiz(),
  });
};
