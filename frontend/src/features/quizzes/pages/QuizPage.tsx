import { useParams } from "react-router-dom";

import QuestionSection from "../components/QuestionSection";
import SummarySection from "../components/SummarySection";
import { useState } from "react";
import { useGetQuizData } from "../hooks/useGetQuizData";

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [answers, setAnswers] = useState([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const [timerId, setTimerId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const { data, error, isLoading } = useGetQuizData(quizId!);

  const color = data?.color ?? "gray";
  const icon = data?.icon ?? null;
  const progress = 0;
  // const progress = data?.progress ?? 0;
  const title = data?.title ?? "";
  const questions = data?.questions ?? [];

  if (isLoading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {String(error)}</p>;

  return (
    <div className="w-full h-full overflow-scroll flex flex-col gap-5">
      {showSummary ? (
        <SummarySection quizId={quizId} answers={answers} timeLeft={timeLeft} />
      ) : (
        <QuestionSection
          quizId={quizId}
          timerId={timerId}
          setShowSummary={setShowSummary}
          showSummary={showSummary}
          setAnswers={setAnswers}
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
