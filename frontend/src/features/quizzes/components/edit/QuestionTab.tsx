import { cn } from "@/lib/utils";

const QuestionTab = ({ isSelected, data, number, handleSelectQuestion }) => {
    return (
        <div
            onClick={() => {
                handleSelectQuestion(number);
            }}
            className={cn(
                "w-full border rounded-md p-3 flex flex-col cursor-pointer gap-2 transition-all duration-200",
                isSelected ? "bg-indigo-50 border-l-4 border-l-indigo-500" : "border-l-4  hover:border-l-indigo-200"
            )}
        >
            <div className="w-full flex flex-row items-center justify-between">
                <div
                    className={cn(
                        "w-5 h-5 bg-gray-200 rounded-sm flex justify-center items-center p-3",
                        isSelected && "bg-indigo-200"
                    )}
                >
                    <p className={cn("text-xs font-semibold text-gray-500", isSelected && "text-indigo-700 ")}>Q1</p>
                </div>
            </div>
            <p className="text-sm">{data.question}</p>
        </div>
    );
};

export default QuestionTab;
