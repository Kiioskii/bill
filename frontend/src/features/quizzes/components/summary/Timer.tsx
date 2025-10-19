import { cn } from "@/lib/utils";
import { formatTime } from "../../utils/formatTime";
import { useEffect, useRef, useState } from "react";

interface TimerProps {
  quizId: string;
  end: boolean;
  handleFinish: () => void;
}

const Timer = ({ quizId, end, handleFinish }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const timerRef = useRef<number | null>(null);

  const isDanger = timeLeft < 60;

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleFinish(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // czyszczenie przy unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (end && timerRef.current) {
      clearInterval(timerRef.current);
      handleFinish(timeLeft);
    }
  }, [end]);

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
};

export default Timer;
