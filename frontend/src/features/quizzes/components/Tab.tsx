import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { createElement, useState } from "react";
import * as FaIcons from "react-icons/fa";
import { FaRegStar, FaStar } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useTranslation } from "react-i18next";
interface QuizI {
  title: string;
  description: string;
  level: "easy" | "medium" | "hard";
  icon: string;
  color: string;
  questions: string;
  isFavorite: boolean;
  progress: number;
}

interface TabProps {
  data: QuizI;
}

const levelColors: Record<QuizI["level"], string> = {
  easy: "text-emerald-500 bg-emerald-100",
  medium: "text-amber-500 bg-amber-100",
  hard: "text-red-500 bg-red-100",
};

const Tab = ({ data }: TabProps) => {
  const { t } = useTranslation("quizzes");
  const [favorite, setFavorite] = useState<boolean>(false);

  const {
    icon,
    color,
    title = "Biology Chapter 5",
    questions = 10,
    level = "medium",
    isFavorite = false,
    progress = 0,
  } = data;

  return (
    <div className="w-full h-fit flex flex-col p-5 bg-white rounded-md border shadow gap-3 ">
      <div className="w full flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <div
            className={cn(
              "w-10 h-10 rounded-md flex justify-center items-center bg-indigo-100 text-indigo-500",
              color && `bg-${color}-100 text-${color}-500`
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
          onClick={() => {
            setFavorite((item) => !item);
          }}
          className={cn(
            "h-10 w-10 rounded-full flex justify-center items-center text-gray-400 cursor-pointer",
            favorite && "text-yellow-400"
          )}
        >
          {favorite ? <FaStar size={20} /> : <FaRegStar size={20} />}
        </div>
      </div>

      <div className="w-full flex flex-row justify-between items-center font-semibold">
        <p className="text-sm text-gray-500">{questions} Questions</p>
        <div
          className={cn(
            "w-fit p-1 px-2 text-xs rounded-xl capitalize",
            levelColors[level]
          )}
        >
          {level}
        </div>
      </div>

      <div className="w-full flex flex-row justify-between text-md capitalize text-gray-500  items-center font-semibold ">
        <p>{t("tab.progress")}</p>
        <p className="text-indigo-500">{progress}%</p>
      </div>

      <Progress
        value={progress}
        color="bg-indigo-600"
        className="bg-indigo-400/20"
      />

      <div className="w-full flex flex-row justify-between gap-2">
        <Button
          size="default"
          className="flex-grow bg-indigo-500 text-white font-bold"
        >
          {t("tab.start")}
        </Button>
        <Button size="icon" variant={"ghost"}>
          <MdEdit />
        </Button>
      </div>
    </div>
  );
};

export default Tab;
