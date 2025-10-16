import { IoClose } from "react-icons/io5";
import { GoDash } from "react-icons/go";
import { FaCheck, FaStar } from "react-icons/fa6";

const DetailedStats = ({ correct, incorrect, skipped, answers }) => {
    return (
        <div className="bg-white w-full flex flex-col border rounded-md p-5 ">
            <div className="w-full grid grid-cols-4 gap-10">
                <div className="w-full flex flex-col items-center gap-1 justify-center p-3 bg-emerald-50 rounded-md">
                    <div className="rounded-full h-10 w-10 bg-emerald-100 text-emerald-500 flex items-center justify-center">
                        <FaCheck />
                    </div>
                    <p className="text-emerald-500 text-2xl font-bold">{correct}</p>
                    <p className="text-sm text-gray-600">Correct Answers</p>
                    <p className="text-sm text-emerald-600">{Math.floor((correct * 100) / answers)}%</p>
                </div>
                <div className="w-full flex flex-col items-center gap-1 justify-center p-3 bg-red-50 rounded-md">
                    <div className="rounded-full h-10 w-10 bg-red-100 text-red-500 flex items-center justify-center">
                        <IoClose />
                    </div>
                    <p className="text-red-500 text-2xl font-bold">{incorrect}</p>
                    <p className="text-sm text-gray-600">Incorrect Answers</p>
                    <p className="text-sm text-red-600">{Math.floor((incorrect * 100) / answers)}%</p>
                </div>
                <div className="w-full flex flex-col items-center gap-1 justify-center p-3 bg-amber-50 rounded-md">
                    <div className="rounded-full h-10 w-10 bg-amber-100 text-amber-500 flex items-center justify-center">
                        <GoDash />
                    </div>
                    <p className="text-amber-500 text-2xl font-bold">{incorrect}</p>
                    <p className="text-sm text-gray-600">Skipped Answers</p>
                    <p className="text-sm text-amber-600">{Math.floor((skipped * 100) / answers)}%</p>
                </div>
                <div className="w-full flex flex-col items-center gap-1 justify-center p-3 bg-cyan-50 rounded-md">
                    <div className="rounded-full h-10 w-10 bg-cyan-100 text-cyan-500 flex items-center justify-center">
                        <FaStar />
                    </div>
                    <p className="text-cyan-500 text-2xl font-bold">{incorrect}</p>
                    <p className="text-sm text-gray-600">Skipped Answers</p>
                    <p className="text-sm text-cyan-600">{Math.floor((incorrect * 100) / answers)}%</p>
                </div>
            </div>
        </div>
    );
};

export default DetailedStats;
