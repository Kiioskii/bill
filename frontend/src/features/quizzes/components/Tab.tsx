import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { createElement, useState } from "react";
import * as FaIcons from "react-icons/fa";
import { FaRegStar, FaStar } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useToggleFavorite } from "../hooks/useToggleFavorite";
import { useNavigate, useParams } from "react-router-dom";
import { colors } from "../utils/colors";
interface QuizI {
    id: string;
    title: string;
    description: string;
    difficulty: "beginner" | "easy" | "medium" | "hard" | "expert";
    icon: string;
    color: string;
    questions: string;
    isFavorite: boolean;
    completed: boolean;
    progress: number;
}

interface TabProps {
    data: QuizI;
}

const difficultyColors: Record<QuizI["difficulty"], string> = {
    easy: "text-emerald-500 bg-emerald-100",
    medium: "text-amber-500 bg-amber-100",
    hard: "text-red-500 bg-red-100",
    expert: "text-red-500 bg-red-100",
};

const Tab = ({ data }: TabProps) => {
    const {
        id,
        icon,
        color,
        title = "Biology Chapter 5",
        questions_count: questions = 10,
        difficulty = "medium",
        isFavorite = false,
        completed = false,
        quiz_progress: progress = 0,
    } = data;
    const navigate = useNavigate();

    const { t } = useTranslation("quizzes");
    const { lng } = useParams();
    const [favorite, setFavorite] = useState(isFavorite || false);
    const { mutate: toggleFavorite } = useToggleFavorite();

    const handleToggleFavorite = () => {
        const newValue = !favorite;
        setFavorite(newValue);
        toggleFavorite({ quizId: id, isFavorite: newValue });
    };

    const handleNavigate = () => {
        navigate(`/${lng}/quizzes/${id}`);
    };

    return (
        <div className="w-full h-fit flex flex-col p-5 bg-white rounded-md border shadow gap-3 ">
            <div className="w full flex flex-row justify-between items-center">
                <div className="flex flex-row gap-3 items-center">
                    <div
                        className={cn(
                            "w-10 h-10 rounded-md flex justify-center items-center bg-indigo-100 text-indigo-500",
                            color && `${colors[color]}`
                        )}
                    >
                        {createElement(FaIcons[icon] || FaIcons.FaCog)}
                    </div>

                    <div className="flex flex-col">
                        <h2 className="text-md font-bold">{title}</h2>
                        {/* <p className="text-xs text-gray-500">{questions} Questions</p> */}
                    </div>
                </div>
                <div
                    onClick={handleToggleFavorite}
                    className={cn(
                        "h-10 w-10 rounded-full flex justify-center items-center text-gray-400 cursor-pointer",
                        favorite && "text-yellow-400"
                    )}
                >
                    {favorite ? <FaStar size={20} /> : <FaRegStar size={20} />}
                </div>
            </div>

            <div className="w-full flex flex-row justify-between items-center font-semibold">
                <p className="text-sm text-gray-500">
                    {questions} {t("tab.questions")}
                </p>
                <div className={cn("w-fit p-1 px-2 text-xs rounded-xl capitalize", difficultyColors[difficulty])}>
                    {difficulty}
                </div>
            </div>

            <div className="w-full flex flex-row justify-between text-md capitalize text-gray-500  items-center font-semibold ">
                {completed ? (
                    <>
                        <p>{t("tab.completed")}</p>
                        <p className="text-emerald-500">
                            {completed ? 100 : Math.floor((+progress[0].answered_count * 100) / questions)}%
                        </p>
                    </>
                ) : (
                    <>
                        <p>{t("tab.progress")}</p>
                        <p className="text-indigo-500">
                            {Math.floor((+progress[0].answered_count * 100) / questions)}%
                        </p>
                    </>
                )}
            </div>

            <Progress
                value={completed ? 100 : Math.floor((+progress[0].answered_count * 100) / questions)}
                color={cn("bg-indigo-600", completed && "bg-emerald-500")}
                className="bg-indigo-400/20"
            />

            <div className="w-full flex flex-row justify-between gap-2">
                <Button
                    size="default"
                    onClick={handleNavigate}
                    // variant={completed ? "defaultLine" : "default"}
                    className={cn(
                        "flex-grow bg-indigo-500 text-white font-bold",
                        completed && "bg-white text-indigo-500 border-1 border-indigo-500 hover:bg-accent "
                    )}
                >
                    {completed
                        ? t("tab.retake")
                        : progress[0].answered_count === 0
                        ? t("tab.start")
                        : t("tab.continue")}
                </Button>
                <Button size="icon" variant={"ghost"}>
                    <MdEdit />
                </Button>
            </div>
        </div>
    );
};

export default Tab;
