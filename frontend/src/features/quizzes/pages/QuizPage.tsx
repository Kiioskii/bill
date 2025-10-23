import { useParams } from "react-router-dom";

import QuestionSection from "../components/QuestionSection";
import SummarySection from "../components/SummarySection";
import { useState } from "react";
import { useGetQuizData } from "../hooks/useGetQuizData";
import { useSaveQuizResult } from "../hooks/useSaveQuizResult";

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [answers, setAnswers] = useState([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const [timerId, setTimerId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const { data, error, isLoading } = useGetQuizData(quizId!);
  const { mutate: saveResult } = useSaveQuizResult();

  const color = data?.color ?? "gray";
  const icon = data?.icon ?? null;
  const progress = 0;
  // const progress = data?.progress ?? 0;
  const title = data?.title ?? "";
  const questions = data?.questions ?? [];

  if (isLoading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {String(error)}</p>;

  const handleFinish = () => {
    setShowSummary(true);
    saveResult({ quizId, answers });
  };

  const handleSaveAnswer = (
    question: number,
    status: string,
    isFavorite: boolean
  ) => {
    setAnswers((prev) => [
      ...prev,
      { question: questions[question].question, status, isFavorite },
    ]);
  };

  return (
    <div className="w-full h-full overflow-scroll flex flex-col gap-5">
      {showSummary ? (
        <SummarySection quizId={quizId} answers={answers} timeLeft={timeLeft} />
      ) : (
        <QuestionSection
          quizId={quizId}
          timerId={timerId}
          handleFinish={handleFinish}
          handleSaveAnswer={handleSaveAnswer}
          showSummary={showSummary}
          setTimerId={setTimerId}
          setTimeLeft={setTimeLeft}
          color={color}
          icon={icon}
          progress={progress}
          title={title}
          questions={questions}
        />
      )}
    </div>
  );
};

export default QuizPage;
