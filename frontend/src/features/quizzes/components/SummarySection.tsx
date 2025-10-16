import { FaCheck, FaStar } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TbReload } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import { FaTrophy } from "react-icons/fa";
import { FaCircleQuestion } from "react-icons/fa6";
import { useMemo } from "react";
import ScoreSummary from "./summary/ScoreSummary";
import QuickStats from "./summary/QuickStats";
import DetailedStats from "./summary/DetailedStats";

const SummarySection = ({ answers }) => {
    const { correct, incorrect, skipped, favorites, score } = useMemo(() => {
        const correct = answers.filter((a) => a.status === "correct");
        const incorrect = answers.filter((a) => a.status === "incorrect");
        const skipped = answers.filter((a) => a.status === "skipped");
        const favorites = answers.filter((a) => a.isFavorite);
        const score = Math.floor((correct.length * 100) / answers.length);
        return { correct, incorrect, skipped, favorites, score };
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
            title: "Grade",
            icon: <FaTrophy size={15} />,
            textColor: "text-violet-500",
            bgColor: "bg-violet-100",
            value: grade(),
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

    console.log("favorites", favorites);

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
            />
            <div className="bg-white w-full flex flex-col border rounded-md p-5 ">
                <div className="flex flex-row items-center text-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-md flex items-center justify-center text-amber-500 bg-amber-100">
                        <FaStar />
                    </div>
                    <p className="text-md font-semibold ">Performance Breakdown</p>
                </div>

                <div className="w-full flex flex-col gap-3">
                    {favorites.map((item, index) => (
                        <div className="w-full flex flex-col border rounded-md p-3 gap-3">
                            <div className="w-full flex flex-row justify-between items-center">
                                <p className="font-semibold text-md">Question {index + 1}</p>
                                <div className="flex flex-row items-center gap-2">
                                    <FaStar className="text-amber-500" />
                                    <FaCheck className="text-emerald-500" />

                                    {/* {item.status === 'correct' && } */}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">{item.question}</p>
                        </div>
                    ))}
                    <p className="text-sm text-indigo-600 flex flex-row items-center gap-1 cursor-pointer hover:text-indigo-500 ">
                        View All Favorites <FaArrowRight />
                    </p>
                </div>
            </div>
            <div className="bg-white w-full flex flex-col border rounded-md p-5 gap-5 ">
                <p className="text-md font-semibold ">Performance Breakdown</p>
                <div className="flex flex-wrap gap-5">
                    {answers.map((item, index) => (
                        <div
                            className={cn(
                                "w-10 h-10 rounded-md text-white font-semibold flex items-center justify-center",
                                item.status === "correct" && "bg-emerald-500",
                                item.status === "incorrect" && "bg-red-500",
                                item.status === "skipped" && "bg-gray-400"
                            )}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
                <div className="w-full flex items-center justify-center">
                    <div className="grid grid-cols-3 w-fit gap-3 ">
                        <div className="flex flex-row items-center gap-1">
                            <div className="h-5 w-5 rounded-sm bg-emerald-300" />
                            <p>Correct</p>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <div className="h-5 w-5 rounded-sm bg-red-500" />
                            <p>Incorrect</p>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <div className="h-5 w-5 rounded-sm bg-gray-400" />
                            <p>Skipped</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white w-full grid grid-cols-3 rounded-md p-5 gap-5 border text-white font-semibold">
                <Button size={"lg"} variant={"default"}>
                    <TbReload />
                    Retry Quiz
                </Button>
                <Button size={"lg"} variant={"secondary"} className="bg-red-500 text-white ">
                    <FaEye />
                    Review Mistakes
                </Button>
                <Button size={"lg"} variant={"secondary"} className="bg-gray-500 text-white ">
                    <MdHome />
                    Back to Dashboard
                </Button>
            </div>
        </div>
    );
};

export default SummarySection;
