import { cn } from "@/lib/utils";

const PerformanceSection = ({ answers }) => {
  return (
    <div className="bg-white w-full flex flex-col border rounded-md p-5 gap-5 ">
      <p className="text-md font-semibold ">Performance Breakdown</p>
      <div className="flex flex-wrap gap-5">
        {answers.map((item, index) => (
          <div
            className={cn(
              "w-10 h-10 rounded-md text-white font-semibold flex items-center justify-center",
              item.status === "correct" && "bg-emerald-500",
              item.status === "incorrect" && "bg-red-500",
              item.status === "skipped" && "bg-gray-400"
            )}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <div className="w-full flex items-center justify-center">
        <div className="grid grid-cols-3 w-fit gap-3 ">
          <div className="flex flex-row items-center gap-1">
            <div className="h-5 w-5 rounded-sm bg-emerald-300" />
            <p>Correct</p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <div className="h-5 w-5 rounded-sm bg-red-500" />
            <p>Incorrect</p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <div className="h-5 w-5 rounded-sm bg-gray-400" />
            <p>Skipped</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSection;
