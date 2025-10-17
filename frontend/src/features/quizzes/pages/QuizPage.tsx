import { useParams } from "react-router-dom";

import QuestionSection from "../components/QuestionSection";
import SummarySection from "../components/SummarySection";
import { useEffect, useState } from "react";

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [answers, setAnswers] = useState([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minut = 900 sekund
  const [timerId, setTimerId] = useState(null);
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    setTimerId(timer);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="w-full h-full overflow-scroll flex flex-col gap-5">
      {showSummary ? (
        <SummarySection quizId={quizId} answers={answers} timeLeft={timeLeft} />
      ) : (
        <QuestionSection
          quizId={quizId}
          timerId={timerId}
          timeLeft={timeLeft}
          setAnswers={setAnswers}
          setShowSummary={setShowSummary}
        />
      )}
    </div>
  );
};

export default QuizPage;
