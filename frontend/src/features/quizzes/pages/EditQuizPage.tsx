import { useParams } from "react-router-dom";
import { useGetQuizData } from "../hooks/useGetQuizData";
import { Button } from "@/components/ui/button";
import { FaPlus, FaRegStar, FaStar } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";
import QuestionTab from "../components/edit/QuestionTab";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnswerOptionItem } from "../components/edit/AnswerOptionItem";

const EditQuizPage = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const { data, error, isLoading } = useGetQuizData(quizId!);

    const [allData, setAllData] = useState<Record<string, any>>({});
    const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

    useEffect(() => {
        if (data?.questions) {
            const questions = data.questions;

            setAllData(
                questions.reduce((acc, item) => {
                    const uid = uuidv4();
                    acc[uid] = item;
                    return acc;
                }, {})
            );
            const firstId = Object.keys(questions)[0];
            setSelectedQuestion(firstId);
        }
    }, [data]);

    if (isLoading) return <p>Ładowanie...</p>;
    if (error) return <p>Błąd: {String(error)}</p>;

    console.log("data", data);
    console.log("allData", allData);

    const handleSelectQuestion = (index) => {
        setSelectedQuestion(index);
    };

    const handleToggleFavorite = () => {
        if (!selectedQuestion) return;
        setAllData((prev) => ({
            ...prev,
            [selectedQuestion]: {
                ...prev[selectedQuestion],
                isFavorite: !prev[selectedQuestion].isFavorite,
            },
        }));
    };

    const handleToggleCorrect = (number: number) => {
        if (!selectedQuestion) return;
        setAllData((prev) => ({
            ...prev,
            [selectedQuestion]: {
                ...prev[selectedQuestion],
                answers: prev[selectedQuestion].answers.map((opt, index) => ({
                    ...opt,
                    correct: index === number,
                })),
            },
        }));
    };

    const onQuestionChange = (text: string) => {
        if (!selectedQuestion) return;
        setAllData((prev) => ({
            ...prev,
            [selectedQuestion]: {
                ...prev[selectedQuestion],
                question: text,
            },
        }));
    };

    const handleAddQuestion = () => {
        const uid = uuidv4();

        const answers = Array.from({ length: 3 }, () => ({
            text: "",
            correct: false,
        }));
        setAllData((prev) => ({
            ...prev,
            [uid]: {
                question: "",
                answers,
                isFavorite: false,
            },
        }));
    };

    const handleAddOption = () => {
        if (!selectedQuestion) return;
        setAllData((prev) => ({
            ...prev,
            [selectedQuestion]: {
                ...prev[selectedQuestion],
                answers: [...prev[selectedQuestion].answers, { text: "", correct: false }],
            },
        }));
    };

    const handleTextChange = (number: string, newText: string) => {
        if (!selectedQuestion) return;
        setAllData((prev) => ({
            ...prev,
            [selectedQuestion]: {
                ...prev[selectedQuestion],
                answers: prev[selectedQuestion].answers.map((opt, index) =>
                    index === number ? { ...opt, text: newText } : opt
                ),
            },
        }));
    };

    const handleDelete = (id: string) => {
        if (!selectedQuestion) return;
        setAllData((prev) => ({
            ...prev,
            [selectedQuestion]: {
                ...prev[selectedQuestion],
                answers: prev[selectedQuestion].answers.filter((opt) => opt.id !== id),
            },
        }));
    };
    const selected = selectedQuestion ? allData[selectedQuestion] : null;
    console.log("selected", selected);

    return (
        <div className="flex flex-col w-full ">
            <div className="w-full flex flex-row gap-5">
                {/* QUESTIONS SECTION */}
                <div className="w-1/4 bg-white border rounded-md p-5 flex flex-col max-h-screen overflow-y-scroll">
                    <div className="flex flex-row items-center justify-between  mb-5">
                        <p className="text-md font-semibold">Questions</p>
                        <Button variant={"default"} onClick={handleAddQuestion}>
                            <FaPlus />
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {Object.entries(allData).map(([id, questionData]) => (
                            <QuestionTab
                                key={id}
                                data={questionData}
                                number={id}
                                handleSelectQuestion={handleSelectQuestion}
                            />
                        ))}
                    </div>
                </div>
                {/* OPTIONS SECTION */}
                <div className="w-3/4 bg-white border rounded-md flex flex-col p-5 gap-5">
                    {selected && (
                        <>
                            <div className="w-full flex flex-row items-center justify-between">
                                <p className="text-xl font-semibold">Question 1</p>
                                <div className="flex flex-row items-center gap-5">
                                    <div
                                        onClick={handleToggleFavorite}
                                        className={cn(
                                            "h-10 w-10 rounded-full flex justify-center items-center text-gray-400 cursor-pointer",
                                            selected.isFavorite && "text-yellow-400"
                                        )}
                                    >
                                        {selected.isFavorite ? <FaStar size={20} /> : <FaRegStar size={20} />}
                                    </div>
                                    <div
                                        onClick={handleToggleFavorite}
                                        className={cn(
                                            "h-10 w-10 rounded-full flex justify-center items-center text-gray-400 cursor-pointer hover:text-red-700"
                                        )}
                                    >
                                        <FaTrashCan size={20} />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex flex-col">
                                <p className="text-sm text-gray-700 font-semibold mb-2">Question Text</p>
                                <textarea
                                    value={selected.question}
                                    onChange={(e) => onQuestionChange(e.target.value)}
                                    className="border rounded-md p-3 h-30 resize-none"
                                />
                            </div>
                            <div className="w-full flex flex-col">
                                <div className="w-full flex flex-row justify-between items-center">
                                    <p className="text-sm text-gray-700 font-semibold mb-2">Answer Options</p>
                                    <Button variant={"defaultLine"} onClick={handleAddOption}>
                                        <FaPlus />
                                        Add Option
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {selected.answers.map((option, index) => (
                                        <AnswerOptionItem
                                            key={option.id}
                                            option={option}
                                            onToggleCorrect={() => handleToggleCorrect(index)}
                                            onTextChange={(text) => handleTextChange(index, text)}
                                            onDelete={() => handleDelete(option.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="w-full flex flex-col">
                                <p className="text-sm text-gray-700 font-semibold mb-2">Explanation (Optional)</p>
                                <textarea className="border rounded-md p-3 h-30 resize-none" />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="w-full flex flex-row justify-between items-center mt-5">
                <Button variant={"ghost"}>Discard Changes</Button>
                <div className="flex flex-row items-center gap-5">
                    <Button variant={"outline"}>Save Draft</Button>
                    <Button variant={"default"}>Save & Continue</Button>
                </div>
            </div>
        </div>
    );
};

export default EditQuizPage;
