import { useParams } from "react-router-dom";
import { useGetQuizData } from "../hooks/useGetQuizData";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import QuestionTab from "../components/edit/QuestionTab";
import { useEffect, useState } from "react";

const EditQuizPage = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const { data, error, isLoading } = useGetQuizData(quizId!);

    const [slecetedQuestion, setSelectedQuestion] = useState(0);

    if (isLoading) return <p>Ładowanie...</p>;
    if (error) return <p>Błąd: {String(error)}</p>;

    useEffect(() => {}, [slecetedQuestion]);

    console.log("data", data);

    return (
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
                    {data.questions.map((item) => (
                        <QuestionTab data={item} />
                    ))}
                </div>
            </div>
            <div className="w-3/4 bg-white border rounded-md"></div>
        </div>
    );
};

export default EditQuizPage;
