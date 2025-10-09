import { useParams } from "react-router-dom";
import { useGetQuizData } from "../hooks/useGetQuizData";

import { Progress } from "@/components/ui/progress";

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();

  const { data, error, isLoading } = useGetQuizData(quizId!);
  if (isLoading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {String(error)}</p>;

  console.log("data", data);

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="flex flex-row justify-between items-center  font-semibold text-slate-500">
        <p>Questions 5 of 30</p>
        <p>17% Complete</p>
      </div>
      <Progress value={20} color="bg-indigo-600" className="bg-gray-400/20" />
      <div className="w-full h-full border shadow rounded-md bg-white"></div>
    </div>
  );
};

export default QuizPage;
