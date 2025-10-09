import { cn } from "@/lib/utils";
import { FaCircleCheck } from "react-icons/fa6";

const QuestionSection = ({ selectedQuestions, handleSelectAnswer, question, answers }) => {
    console.log("{ selectedQuestions, handleSelectAnswer, question, answers }", {
        selectedQuestions,
        handleSelectAnswer,
        question,
        answers,
    });
    const letters = ["A", "B", "C", "D"];

    return (
        <>
            <p className="font-semibold text-xl">{question}</p>
            <div className="w-full font-semibold flex flex-col gap-5 mt-10">
                {answers.map((item, index) => (
                    <div
                        onClick={() => {
                            handleSelectAnswer(index);
                        }}
                        className={cn(
                            "w-full border-2 flex flex-row items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-indigo-50",
                            selectedQuestions === index && "border-indigo-500 bg-indigo-50"
                        )}
                    >
                        {selectedQuestions === index ? (
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
        </>
    );
};

export default QuestionSection;
