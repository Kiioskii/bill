import { ClipLoader } from "react-spinners";
import { useListQuiz } from "../hooks/useListQuiz";
import Tab from "./Tab";

const QuizTabs = () => {
  const { data, error, isPending } = useListQuiz();

  console.log("data", data);

  if (isPending)
    return (
      <div className="w-full h-full flex  justify-center align-middle">
        <ClipLoader
          loading={isPending}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((quiz) => (
        <Tab data={quiz} key={quiz.id} />
      ))}
    </div>
  );
};

export default QuizTabs;
