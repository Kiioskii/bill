import { Input } from "@/components/ui/input";
import { GripVertical, Trash2 } from "lucide-react";

export const AnswerOptionItem = ({ option, onToggleCorrect, onTextChange, onDelete }) => {
    return (
        <div className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition">
            <GripVertical className="text-gray-400 w-4 h-4" />

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    checked={option.correct}
                    onChange={onToggleCorrect}
                    className="text-blue-600 focus:ring-2 focus:ring-blue-500"
                    name="correct-answer"
                />
                <span className={option.correct ? "text-green-600 font-medium" : "text-gray-500"}>Correct</span>
            </label>

            <Input
                value={option.text}
                onChange={(e) => onTextChange(e.target.value)}
                placeholder="Answer text"
                className="flex-1 "
            />

            {/* Delete button */}
            <button onClick={onDelete} className="text-gray-400 cursor-pointer hover:text-red-500 transition">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
};
