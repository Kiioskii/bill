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

    const [selectedQuestion, setSelectedQuestion] = useState(0);
    const [favorite, setFavorite] = useState(false);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (data && data.questions && data.questions[selectedQuestion]) {
            const question = data.questions[selectedQuestion];

            setQuestion(question.question);
            setOptions(
                question.answers?.map((a, index) => ({
                    id: a.id || uuidv4(), // ID z API lub fallback
                    text: a.text,
                    correct: a.correct,
                })) || []
            );

            setFavorite(question.isFavorite || false);
        }
    }, [data, selectedQuestion]);

    if (isLoading) return <p>Ładowanie...</p>;
    if (error) return <p>Błąd: {String(error)}</p>;

    console.log("data", data);

    const handleSelectQuestion = (index) => {
        setSelectedQuestion(index);
    };

    const handleToggleFavorite = () => {
        const newValue = !favorite;
        setFavorite(newValue);
    };

    const handleToggleCorrect = (id) => {
        setOptions((prev) =>
            prev.map((opt) => ({
                ...opt,
                correct: opt.id === id,
            }))
        );
    };

    const onQuestionChange = (text) => {
        setQuestion(text);
    };

    const handleTextChange = (id, newText) => {
        setOptions((prev) => prev.map((opt) => (opt.id === id ? { ...opt, text: newText } : opt)));
    };

    const handleDelete = (id) => {
        setOptions((prev) => prev.filter((opt) => opt.id !== id));
    };

    return (
        <div className="flex flex-col w-full ">
            <div className="w-full flex flex-row gap-5">
                <div className="w-1/4 bg-white border rounded-md p-5 flex flex-col max-h-screen overflow-y-scroll">
                    <div className="flex flex-row items-center justify-between  mb-5">
                        <p className="text-md font-semibold">Questions</p>
                        <Button variant={"default"}>
                            <FaPlus />
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {data.questions.map((item, index) => (
                            <QuestionTab data={item} number={index} handleSelectQuestion={handleSelectQuestion} />
                        ))}
                    </div>
                </div>
                <div className="w-3/4 bg-white border rounded-md flex flex-col p-5 gap-5">
                    <div className="w-full flex flex-row items-center justify-between">
                        <p className="text-xl font-semibold">Question 1</p>
                        <div className="flex flex-row items-center gap-5">
                            <div
                                onClick={handleToggleFavorite}
                                className={cn(
                                    "h-10 w-10 rounded-full flex justify-center items-center text-gray-400 cursor-pointer",
                                    favorite && "text-yellow-400"
                                )}
                            >
                                {favorite ? <FaStar size={20} /> : <FaRegStar size={20} />}
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
                            value={question}
                            onChange={(e) => onQuestionChange(e.target.value)}
                            className="border rounded-md p-3 h-30 resize-none"
                        />
                    </div>
                    <div className="w-full flex flex-col">
                        <p className="text-sm text-gray-700 font-semibold mb-2">Answer Options</p>
                        <div className="space-y-3">
                            {options.map((option) => (
                                <AnswerOptionItem
                                    key={option.id}
                                    option={option}
                                    onToggleCorrect={() => handleToggleCorrect(option.id)}
                                    onTextChange={(text) => handleTextChange(option.id, text)}
                                    onDelete={() => handleDelete(option.id)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="w-full flex flex-col">
                        <p className="text-sm text-gray-700 font-semibold mb-2">Explanation (Optional)</p>
                        <textarea className="border rounded-md p-3 h-30 resize-none" />
                    </div>
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
