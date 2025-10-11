import { FaCheck, FaStar } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { GoDash } from "react-icons/go";

const SummarySection = ({ quizId, answers }) => {
    console.log("answers", answers);
    const correct = answers.filter((item) => item.status === "correct");
    const incorrect = answers.filter((item) => item.status === "incorrect");
    const skipped = answers.filter((item) => item.status === "skipped");

    return (
        <div className="w-full h-full flex flex-col gap-5">
            <div className="w-full flex flex-row gap-5 justify-between">
                <div className="bg-white w-2/3  border rounded-md p-5">
                    <div className="flex flex-row justify-between  mb-5">
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold">Your Score</h2>
                            <h2 className="text-sm text-gray-500">You passed the quiz</h2>
                        </div>
                        <div></div>
                    </div>
                    <div className="w-fit grid grid-cols-3 gap-20  ">
                        <div className=" w-fit px-2 flex flex-col justify-center items-center ">
                            <h4 className="text-2xl font-bold text-green-600">{correct.length}</h4>
                            <p className="text-xm text-gray-500">Correct</p>
                        </div>
                        <div className="w-fit px-2  flex flex-col justify-center items-center ">
                            <h4 className="text-2xl font-bold text-red-600">{incorrect.length}</h4>
                            <p className="text-xm text-gray-500">Incorrect</p>
                        </div>
                        <div className="w-fit px-2  flex flex-col justify-center items-center">
                            <p className="text-2xl font-bold text-amber-600">{skipped.length}</p>
                            <p className="text-xm text-gray-500">Skipped</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border w-1/3 rounded-md"></div>
            </div>
            <div className="bg-white w-full flex flex-col border rounded-md p-5 ">
                <p className="text-md font-semibold mb-5">Performance Breakdown</p>
                <div className="w-full grid grid-cols-4 gap-10">
                    <div className="w-full flex flex-col items-center gap-1 justify-center p-3 bg-emerald-50 rounded-md">
                        <div className="rounded-full h-10 w-10 bg-emerald-100 text-emerald-500 flex items-center justify-center">
                            <FaCheck />
                        </div>
                        <p className="text-emerald-500 text-2xl font-bold">{correct.length}</p>
                        <p className="text-sm text-gray-600">Correct Answers</p>
                        <p className="text-sm text-emerald-600">
                            {Math.floor((correct.length * 100) / answers.length)}%
                        </p>
                    </div>
                    <div className="w-full flex flex-col items-center gap-1 justify-center p-3 bg-red-50 rounded-md">
                        <div className="rounded-full h-10 w-10 bg-red-100 text-red-500 flex items-center justify-center">
                            <IoClose />
                        </div>
                        <p className="text-red-500 text-2xl font-bold">{incorrect.length}</p>
                        <p className="text-sm text-gray-600">Incorrect Answers</p>
                        <p className="text-sm text-red-600">{Math.floor((incorrect.length * 100) / answers.length)}%</p>
                    </div>
                    <div className="w-full flex flex-col items-center gap-1 justify-center p-3 bg-amber-50 rounded-md">
                        <div className="rounded-full h-10 w-10 bg-amber-100 text-amber-500 flex items-center justify-center">
                            <GoDash />
                        </div>
                        <p className="text-amber-500 text-2xl font-bold">{incorrect.length}</p>
                        <p className="text-sm text-gray-600">Skipped Answers</p>
                        <p className="text-sm text-amber-600">
                            {Math.floor((incorrect.length * 100) / answers.length)}%
                        </p>
                    </div>
                    <div className="w-full flex flex-col items-center gap-1 justify-center p-3 bg-cyan-50 rounded-md">
                        <div className="rounded-full h-10 w-10 bg-cyan-100 text-cyan-500 flex items-center justify-center">
                            <FaStar />
                        </div>
                        <p className="text-cyan-500 text-2xl font-bold">{incorrect.length}</p>
                        <p className="text-sm text-gray-600">Skipped Answers</p>
                        <p className="text-sm text-cyan-600">
                            {Math.floor((incorrect.length * 100) / answers.length)}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummarySection;
