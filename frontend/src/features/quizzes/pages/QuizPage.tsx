import { useParams } from "react-router-dom";
import { useGetQuizData } from "../hooks/useGetQuizData";

import { FaCircleCheck } from "react-icons/fa6";
import * as FaIcons from "react-icons/fa";

import { AnimatePresence, motion } from "framer-motion";

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
    const [questionNumber, setQuestionNumber] = useState(0);
    const [selectedQuestions, setSelectedQuestion] = useState<number>(-1);
    const { t } = useTranslation("quizzes");

    const { data, error, isLoading } = useGetQuizData(quizId!);
    const { mutate: makeProgress } = useMakeQuizProgress();

    console.log("questionNumber", questionNumber);

    if (isLoading) return <p>Ładowanie...</p>;
    if (error) return <p>Błąd: {String(error)}</p>;

    const handleSelectAnswer = (index: number) => {
        setSelectedQuestion(index);

        setTimeout(() => {
            if (questionNumber < data.questions.length - 1) {
                makeProgress({ quizId, progress: questionNumber + 1 });
                setQuestionNumber((prev) => prev + 1);
                setSelectedQuestion(-1);
            } else {
                console.log("Koniec quizu!");
            }
        }, 1000);
    };

    return (
        <AnimatePresence mode="wait">
            <div className="w-full h-full flex flex-col gap-5">
                <div className="flex flex-row justify-between items-center  font-semibold text-slate-500">
                    <p>
                        {t("page.questions")} {questionNumber + 1} {t("page.of")} {data.questions.length}
                    </p>
                    <div className=" flex flex-row items-center gap-3">
                        <div
                            className={cn(
                                "w-10 h-10 rounded-md flex justify-center items-center bg-indigo-100 text-indigo-500",
                                data?.color && `${colors[data?.color]}`
                            )}
                        >
                            {createElement(FaIcons[data?.icon] || FaIcons.FaCog)}
                        </div>
                        <p className="text-xl text-slate-800">{data.title}</p>
                    </div>
                    <p>
                        {Math.floor(((questionNumber + 1) * 100) / data.questions.length)}% {t("page.complete")}
                    </p>
                </div>
                <Progress
                    value={Math.floor(((questionNumber + 1) * 100) / data.questions.length)}
                    color="bg-indigo-600"
                    className="bg-gray-400/20 duration-75 "
                />
                <motion.div
                    key={questionNumber}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.7 }}
                    className="w-full h-full border shadow rounded-md bg-white flex flex-col p-5 text-gray-700"
                >
                    {questionNumber === data.questions.length ? (
                        <QuestionSection
                            selectedQuestions={selectedQuestions}
                            handleSelectAnswer={handleSelectAnswer}
                            question={data?.questions[questionNumber]?.question}
                            answers={data?.questions[questionNumber]?.answers}
                        />
                    ) : (
                        <SummarySection />
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default QuizPage;
