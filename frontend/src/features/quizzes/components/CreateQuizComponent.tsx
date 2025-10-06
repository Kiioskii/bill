import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { createElement, useState, type FormEvent } from "react";
import { useCreateQuiz } from "../hooks/useCreateQuiz";
import { useAppSelector } from "@/app/store";
import ColorSelector from "@/features/categories/components/ColorSelector";
import SelectIcon from "@/components/select-icon";
import * as FaIcons from "react-icons/fa";

const levels = [
  { title: "Beginner", color: "accent-green-500" },
  { title: "Junior", color: "accent-green-500" },
  { title: "Mid", color: "accent-blue-500" },
  { title: "Advanced", color: "accent-orange-500" },
  { title: "Expert", color: "accent-red-500" },
];

const questionsCountOptions: string[] = [
  "Auto",
  "10",
  "20",
  "30",
  "50",
  "70",
  "100",
];

const CreateQuizComponent = () => {
  const [value, setValue] = useState(2);
  const [title, setTitle] = useState<string>("");
  const [color, setColor] = useState<string>("blue-500");
  const [difficulty, setDifficulty] = useState<string>("Mid");
  const [description, setDescription] = useState<string>("");
  const [questionsCount, setQuestionsCount] = useState<string>("Auto");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState<boolean>(false);
  const fileIds = useAppSelector((state) => state.quizzes.fileIds);

  const { mutate: createQuiz, isPending } = useCreateQuiz();

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setValue(newValue);
    setDifficulty(levels[newValue].title);
  };

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast("Title can not be empty", "error");
      return;
    }
    if (levels.filter((item) => item.title === difficulty).length === 0) {
      showToast("There is a problem with difficulty level", "error");
      return;
    }

    if (
      questionsCountOptions.filter((item) => item === questionsCount).length ===
      0
    ) {
      showToast("There is a problem with questions count", "error");
      return;
    }
    if (!fileIds.length) {
      showToast("There is a problem with selected files", "error");
      return;
    }

    createQuiz({
      title,
      description,
      questionsCount,
      difficulty,
      fileIds,
      icon: selectedIcon,
      color,
    });
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="grid w-[40vw] max-w-xl gap-4  text-black py-4"
    >
      <div className="w-full flex flex-row gap-2">
        <Input
          type="text"
          placeholder="Quiz title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Select value={questionsCount} onValueChange={setQuestionsCount}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select questions count" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Options</SelectLabel>
              {questionsCountOptions.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full flex flex-col justify-start">
        <label className="font-semibold text-sm mb-2">Difficulty level</label>
        <input
          type="range"
          min="0"
          max={levels.length - 1}
          value={value}
          step="1"
          onChange={handleChange}
          className={`w-full ${levels[value].color} cursor-pointer `}
        />
        <div className="flex justify-between text-sm font-medium mt-2">
          {levels.map((lvl, i) => {
            return (
              <span
                key={i}
                className={cn(
                  i === value ? `text-blue-500 font-bold` : "text-gray-500"
                )}
              >
                {lvl.title}
              </span>
            );
          })}
        </div>
      </div>

      <div className="w-full flex flex-row justify-between ">
        <div className="w-2/3">
          <ColorSelector value={color} onChange={setColor} />
        </div>
        <div className="flex items-center justify-between space-x-2 ">
          <Button
            variant="outline"
            type="button"
            onClick={() => setShowIconPicker(true)}
          >
            {selectedIcon ? (
              <>
                {createElement(FaIcons[selectedIcon], { size: 20 })}
                <span className="ml-2">Change icon</span>
              </>
            ) : (
              "Chose icon"
            )}
          </Button>
        </div>
      </div>

      <div className="w-full flex flex-col mb-2">
        <label className="font-semibold text-sm mb-2">
          Additional data (optional)
        </label>
        <Textarea
          placeholder="Type your message here."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {showIconPicker && (
        <SelectIcon
          setSelectedIcon={setSelectedIcon}
          setShowIconPicker={setShowIconPicker}
        />
      )}
      <div className="flex flex-row justify-end">
        <Button type="submit">
          {isPending ? "Uploading ..." : "Create quiz"}
        </Button>
      </div>
    </form>
  );
};

export default CreateQuizComponent;
