import { FaArrowRight, FaCheck, FaStar } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const FavoriteStats = ({ favorites }) => {
  return (
    <div className="bg-white w-full flex flex-col border rounded-md p-5 ">
      <div className="flex flex-row items-center text-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-md flex items-center justify-center text-amber-500 bg-amber-100">
          <FaStar />
        </div>
        <p className="text-md font-semibold ">Performance Breakdown</p>
      </div>

      <div className="w-full flex flex-col gap-3">
        {favorites.map((item, index) => (
          <div className="w-full flex flex-col border rounded-md p-3 gap-3">
            <div className="w-full flex flex-row justify-between items-center">
              <p className="font-semibold text-md">Question {index + 1}</p>
              <div className="flex flex-row items-center gap-2">
                <FaStar className="text-amber-500" />

                {item.status === "correct" ? (
                  <FaCheck className="text-emerald-500" />
                ) : (
                  <IoClose className="text-red-500" />
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600">{item.question}</p>
          </div>
        ))}
        <p className="text-sm text-indigo-600 flex flex-row items-center gap-1 cursor-pointer hover:text-indigo-500 ">
          View All Favorites <FaArrowRight />
        </p>
      </div>
    </div>
  );
};

export default FavoriteStats;
