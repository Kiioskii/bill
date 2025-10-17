import { cn } from "@/lib/utils";
import { formatTime } from "../../utils/formatTime";

export default function Timer({ timeLeft }) {
  const isDanger = timeLeft < 60; // poniżej 1 minuty

  return (
    <div className="flex items-center rounded-md bg-indigo-50 justify-center p-1 ">
      <h1
        className={cn(
          `text-md font-bold transition-colors duration-300`,
          isDanger ? "text-red-600" : "text-indigo-500"
        )}
      >
        {formatTime(timeLeft)}
      </h1>
    </div>
  );
}
