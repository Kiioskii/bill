import { FaCheck, FaStar } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TbReload } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import { FaTrophy } from "react-icons/fa";
import { FaCircleQuestion } from "react-icons/fa6";
import { FaClock } from "react-icons/fa6";
import { useMemo } from "react";
import ScoreSummary from "./summary/ScoreSummary";
import QuickStats from "./summary/QuickStats";
import DetailedStats from "./summary/DetailedStats";
import { formatTime } from "../utils/formatTime";
import FavoriteStats from "./summary/FavoriteStats";
import PerformanceSection from "./summary/PerformanceSection";
import ActionsSection from "./summary/ActionsSection";

const SummarySection = ({ answers, timeLeft }) => {
  const { correct, incorrect, skipped, favorites, score, time } =
    useMemo(() => {
      const correct = answers.filter((a) => a.status === "correct");
      const incorrect = answers.filter((a) => a.status === "incorrect");
      const skipped = answers.filter((a) => a.status === "skipped");
      const favorites = answers.filter((a) => a.isFavorite);
      const score = Math.floor((correct.length * 100) / answers.length);
      const time = formatTime(15 * 60 - timeLeft);
      return { correct, incorrect, skipped, favorites, score, answers, time };
    }, [answers]);

  const grade = () => {
    if (score < 50) return <p className="text-rose-600">F</p>;
    if (score <= 60) return <p className="text-orange-600">E</p>;
    if (score <= 70) return <p className="text-yellow-900">D</p>;
    if (score <= 80) return <p className="text-amber-600">C</p>;
    if (score <= 90) return <p className="text-sky-500">B</p>;
    if (score > 90) return <p className="text-green-400">A</p>;
  };

  const quickStats = [
    {
      title: "Time taken",
      icon: <FaClock size={15} />,
      textColor: "text-fuchsia-500",
      bgColor: "bg-fuchsia-100",
      value: time,
    },
    {
      title: "Grade",
      icon: <FaTrophy size={15} />,
      textColor: "text-violet-500",
      bgColor: "bg-violet-100",
      value: grade(),
    },
    {
      title: "Favorites",
      icon: <FaStar size={15} />,
      textColor: "text-amber-500",
      bgColor: "bg-amber-100",
      value: favorites.length,
    },
    {
      title: "Total Questions",
      icon: <FaCircleQuestion size={15} />,
      textColor: "text-sky-500",
      bgColor: "bg-sky-100",
      value: answers.length,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="w-full flex flex-row gap-5 justify-between">
        <ScoreSummary
          correct={correct.length}
          incorrect={incorrect.length}
          skipped={skipped.length}
          score={score}
        />
        <QuickStats data={quickStats} />
      </div>
      <DetailedStats
        correct={correct.length}
        incorrect={incorrect.length}
        skipped={skipped.length}
        answers={answers.length}
        favorites={favorites.length}
      />

      <FavoriteStats favorites={favorites} />

      <PerformanceSection answers={answers} />

      <ActionsSection />
    </div>
  );
};

export default SummarySection;
