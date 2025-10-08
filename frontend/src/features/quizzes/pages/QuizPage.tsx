import { useParams } from "react-router-dom";
import { useGetQuizData } from "../hooks/useGetQuizData";

const QuizPage = () => {
    const { quizId } = useParams<{ quizId: string }>();

    const { data, error, isLoading } = useGetQuizData(quizId!);
    if (isLoading) return <p>Ładowanie...</p>;
    if (error) return <p>Błąd: {String(error)}</p>;

    return <div>QuizPage</div>;
};

export default QuizPage;
