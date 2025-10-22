import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { createElement, useEffect, useState } from "react";
import { FaCircleCheck, FaRegStar, FaStar } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";

import { useGetQuizData } from "../hooks/useGetQuizData";

import * as FaIcons from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { colors } from "../utils/colors";
import { useTranslation } from "react-i18next";
import { useMakeQuizProgress } from "../hooks/useMakeQuizProgress";
import { useSetFavoriteQuestion } from "../hooks/useSetFavoriteQuestion";
import { useUnsetFavoriteQuestion } from "../hooks/useUnsetFavoriteQuestion";
import Timer from "./summary/Timer";

const QuestionSection = ({
  quizId,
  setAnswers,
  setTimeLeft,
  setShowSummary,
  color,
  icon,
  progress,
  title,
  questions,
}: {
  quizId: string;
  timeLeft: number;
  setAnswers: void;
  setTimeLeft: void;
  setShowSummary: void;
  color: string;
  icon: string;
  progress: number;
  title: string;
  questions: any[];
}) => {
  const letters = ["A", "B", "C", "D"];

  console.log("questions", questions);

  const [getTime, setGetTime] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(progress ?? 0);
  const [favorite, setFavorite] = useState(
    questions[questionNumber].isFavorite || false
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);

  const { t } = useTranslation("quizzes");
  const { mutate: makeProgress } = useMakeQuizProgress();
  const { mutate: setFavoriteQuestion } = useSetFavoriteQuestion();
  const { mutate: unsetFavoriteQuestion } = useUnsetFavoriteQuestion();

  const handleFavoriteQuestion = () => {
    const newState = !favorite;
    const question = questionNumber;
    setFavorite((prev) => !prev);
    // if (newState) {
    //     setFavoriteQuestion({ quizId, question });
    // } else {
    //     unsetFavoriteQuestion({ quizId, question });
    // }
  };

  const handleSelectAnswer = (index: number) => {
    const answer = index;
    const isFavorite = favorite;
    const question = questionNumber;
    setSelectedAnswer(answer);
    let status = "skipped";
    if (answer === -1) {
      status = "skipped";
    } else {
      status = questions[question].answers[answer].correct
        ? "correct"
        : "incorrect";
    }

    //GET FINAL TIME
    if (question + 1 === questions.length) {
      setGetTime(true);
    }

    setAnswers((prev) => [
      ...prev,
      { question: questions[question].question, status, isFavorite },
    ]);

    setTimeout(() => {
      if (question + 1 < questions.length) {
        setFavorite(questions[question + 1].isFavorite);
      }
      // makeProgress({ quizId, progress: questionNumber });

      if (questionNumber < questions.length - 1) {
        setQuestionNumber((prev) => prev + 1);
        setSelectedAnswer(-1);
      } else {
        setShowSummary(true);
      }
    }, 1000);
  };

  return (
    <AnimatePresence mode="wait">
      <div className="w-full h-full overflow-scroll flex flex-col gap-5">
        <div className="flex flex-row justify-between items-center  font-semibold text-slate-500">
          <p>
            {t("page.questions")} {questionNumber + 1} {t("page.of")}{" "}
            {questions.length}
          </p>
          <div className=" flex flex-row items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-md flex justify-center items-center bg-indigo-100 text-indigo-500",
                color && `${colors[color]}`
              )}
            >
              {createElement(FaIcons[icon] || FaIcons.FaCog)}
            </div>
            <p className="text-xl text-slate-800">{title}</p>
          </div>
          <div className="w-fit flex flex-row gap-5 items-center">
            <div>
              <Timer end={getTime} handleFinish={(item) => setTimeLeft(item)} />
            </div>
            {Math.floor((questionNumber * 100) / questions.length)}%{" "}
            {t("page.complete")}
          </div>
        </div>

        <div className="w-full">
          <Progress
            value={Math.floor((questionNumber * 100) / questions.length)}
            color="bg-indigo-600"
            className="bg-gray-400/20 w-full "
          />
        </div>
        <motion.div
          key={questionNumber}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.7 }}
          className="w-full h-full border shadow gap-2 rounded-md bg-white flex flex-col p-5 text-gray-700 "
        >
          <div className="w-full flex flex-row justify-between">
            <div
              onClick={handleFavoriteQuestion}
              className={cn(
                "h-10 w-10 right-0 top-0 rounded-full flex justify-center items-center text-gray-400 cursor-pointer",
                favorite && "text-yellow-400"
              )}
            >
              {favorite ? <FaStar size={20} /> : <FaRegStar size={20} />}
            </div>
            <div
              onClick={() => {
                handleSelectAnswer(-1);
              }}
              className={cn(
                "h-8 w-8 right-0 top-0 rounded-full flex justify-center items-center text-gray-400 cursor-pointer hover:bg-gray-200"
              )}
            >
              <FaArrowRight size={15} />
            </div>
          </div>
          <p className="font-semibold text-xl">
            {questions[questionNumber].question}
          </p>
          <div className="w-full font-semibold flex flex-col gap-5 mt-10 ">
            {questions[questionNumber].answers.map((item, index) => (
              <div
                onClick={() => {
                  if (selectedAnswer === -1) {
                    handleSelectAnswer(index);
                  }
                }}
                className={cn(
                  "w-full border-2 flex flex-row items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-indigo-50",
                  selectedAnswer === index && "border-indigo-500 bg-indigo-50"
                )}
              >
                {selectedAnswer === index ? (
                  <FaCircleCheck className="text-indigo-500 w-6 h-6" />
                ) : (
                  <div className="rounded-full w-6 h-6 border-2 flex items-center justify-center border-slate-300 p-3">
                    {letters[index]}
                  </div>
                )}
                {item.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuestionSection;
