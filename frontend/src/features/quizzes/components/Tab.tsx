import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { createElement, useState } from "react";
import * as FaIcons from "react-icons/fa";
import { FaRegStar, FaStar } from "react-icons/fa";
interface QuizI {
  title: string;
  description: string;
  level: string;
  icon: string;
  color: string;
  questions: string;
  isFavorite: bool;
  progress: number;
}

const Tab = (data: QuizI) => {
  const [favorite, setFavorite] = useState<boolean>(false);

  const {
    icon = "FaCog",
    color = "blue",
    title = "Biology Chapter 5",
    questions = 10,
    level = "Easy",
    isFavorite = false,
    progress = 0,
  } = data;
  return (
    <div className="w-full h-fit flex flex-col p-5 bg-white rounded-md border shadow gap-5 ">
      <div className="w full flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <div
            className="w-10 h-10 rounded-md flex justify-center items-center bg-indigo-100 "
            // style={{ backgroundColor: color, color: "white" }}
          >
            {createElement(FaIcons[icon], { color })}
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

      <div className="w-full flex flex-row justify-between">
        <p className="text-sm text-gray-400">{questions} Questions</p>
      </div>

      <Progress value={33} color="bg-indigo-600" className="bg-indigo-400/20" />

      <Button size={"lg"} className="bg-indigo-500 text-white font-bold">
        Start
      </Button>
    </div>
  );
};

export default Tab;
