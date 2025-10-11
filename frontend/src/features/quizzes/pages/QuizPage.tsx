import { useParams } from "react-router-dom";
import { useGetQuizData } from "../hooks/useGetQuizData";

import * as FaIcons from "react-icons/fa";

import { AnimatePresence } from "framer-motion";

import { Progress } from "@/components/ui/progress";
import { createElement, useState } from "react";
import { cn } from "@/lib/utils";
import { colors } from "../utils/colors";
import { useTranslation } from "react-i18next";
import { useMakeQuizProgress } from "../hooks/useMakeQuizProgress";
import QuestionSection from "../components/QuestionSection";
import SummarySection from "../components/SummarySection";

const QuizPage = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const [answers, setAnswers] = useState([]);
    const [showSummary, setShowSummary] = useState<boolean>(false);

    return (
        <div className="w-full h-full overflow-scroll flex flex-col gap-5">
            {showSummary ? (
                <SummarySection quizId={quizId} answers={answers} />
            ) : (
                <QuestionSection quizId={quizId} setAnswers={setAnswers} setShowSummary={setShowSummary} />
            )}
        </div>
    );
};

export default QuizPage;
