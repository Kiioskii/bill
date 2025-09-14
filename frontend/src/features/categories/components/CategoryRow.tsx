import { createElement, useState } from "react";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import * as FaIcons from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { cn } from "@/lib/utils";
import DocumentsByCategoryTable from "@/features/documents/components/DocumentsByCategoryTable";

const CategoryRow = ({ item, addNewDocumentHandler }) => {
  const [showTable, setShowTable] = useState<boolean>(false);

  return (
    <div className="w-full h-fit flex flex-col mb-3">
      <div className="w-full gap-1 h-8 flex justify-start items-center text-gray-400 mb-2">
        <div
          className="w-8 h-full rounded-md hover:bg-gray-100 flex justify-center items-center cursor-pointer"
          onClick={() => {
            setShowTable((p) => !p);
          }}
        >
          <TbTriangleInvertedFilled
            size={12}
            className={cn(
              "transition-transform duration-300",
              !showTable && "-rotate-90"
            )}
          />
        </div>
        <div
          className={cn(
            "h-full px-2 text-white  rounded-md w-fit items-center flex flex-row gap-2 capitalize",
            item.color && `bg-${item.color}`
          )}
        >
          {item.icon ? (
            <>{createElement(FaIcons[item.icon], { size: 20 })} </>
          ) : (
            <>{createElement(FaIcons[FaBattleNet], { size: 20 })} </>
          )}
          {item.name}
        </div>
        <div className="w-8 h-full rounded-md hover:bg-gray-100 flex justify-center items-center cursor-pointer">
          <HiDotsHorizontal size={12} />
        </div>
        <div
          onClick={() => addNewDocumentHandler(item.id)}
          className="w-fit h-full rounded-md hover:bg-gray-100 flex justify-center items-center cursor-pointer text-xs gap-1 px-1"
        >
          <>{createElement(FaIcons["FaPlus"], { size: 12 })} </>
          Add new file
        </div>
      </div>

      {showTable && (
        <DocumentsByCategoryTable categoryId={item.id} color={item.color} />
      )}
    </div>
  );
};

export default CategoryRow;
