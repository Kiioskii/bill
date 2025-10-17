import { ScoreChart } from "./ScoreChart";

const ScoreSummary = ({ correct, incorrect, skipped, score }) => {
  return (
    <div className="bg-white w-2/3  rounded-md p-5 flex flex-row border">
      <div className="flex flex-col w-2/3  items-center ">
        <div className="flex flex-row justify-between mb-5 w-full">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Your Score</h2>
            <h2 className="text-sm text-gray-500">You passed the quiz</h2>
          </div>
        </div>
        <div className=" flex flex-1 items-center">
          <div className="w-fit grid grid-cols-3 gap-20 ">
            <div className=" w-fit px-2 flex flex-col justify-center items-center ">
              <h4 className="text-3xl font-bold text-green-600">{correct}</h4>
              <p className="text-xm text-gray-500">Correct</p>
            </div>
            <div className="w-fit px-2  flex flex-col justify-center items-center ">
              <h4 className="text-3xl font-bold text-red-600">{incorrect}</h4>
              <p className="text-xm text-gray-500">Incorrect</p>
            </div>
            <div className="w-fit px-2  flex flex-col justify-center items-center">
              <p className="text-3xl font-bold text-amber-600">{skipped}</p>
              <p className="text-xm text-gray-500">Skipped</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-1/3 relative">
        <img
          src={"/img/confetti.png"}
          alt="confetti"
          width={50}
          className="absolute top-0 right-0"
        />
        <ScoreChart score={score} />
      </div>
    </div>
  );
};

export default ScoreSummary;
