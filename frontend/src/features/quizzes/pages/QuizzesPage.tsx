import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";
import { Search } from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import Tab from "../components/Tab";
import QuizTabs from "../components/QuizTabs";
const QuizzesPage = () => {
  return (
    <div className=" w-full h-fit flex flex-col justify-center gap-5">
      <div className="w-full justify-between items-center flex flex-row">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Your Quizzes</h1>
          <p className="text-sm text-gray-500">
            Chose a quiz to test your knowledge
          </p>
        </div>
        <Button variant={"secondary"}>
          <FaPlus />
          Create Quiz
        </Button>
      </div>
      <div className="w-full p-5 flex flex-row bg-white rounded-md border h-20">
        <div className="relative w-2/3">
          <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-md" />
          <input
            type="text"
            placeholder="Search quiz..."
            className="pl-8 pr-2 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <QuizTabs />
    </div>
  );
};

export default QuizzesPage;
