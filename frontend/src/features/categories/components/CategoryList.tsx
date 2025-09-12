import { cn } from "@/lib/utils";
import { useCategoryList } from "../hooks/useCategoryList";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import * as FaIcons from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";

import { createElement, useState } from "react";
import { ClipLoader } from "react-spinners";
import Dialog from "@/components/dialog";
import CreateFileComponent from "@/features/documents/components/CreateFileComponent";
const CategoryList = () => {
  const [openNewFileDialog, setOpenNewFileDialog] = useState<boolean | string>(
    false
  );
  const { data, error, isPending } = useCategoryList();

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
    <div className="w-full h-fit">
      {Array.isArray(data) ? (
        data?.map((item) => (
          <div className="w-full border gap-1 h-8 flex justify-start items-center text-gray-400">
            <div className="w-8 h-full rounded-md hover:bg-gray-100 flex justify-center items-center cursor-pointer">
              <TbTriangleInvertedFilled size={12} />
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
              onClick={() => setOpenNewFileDialog(item.id)}
              className="w-fit h-full rounded-md hover:bg-gray-100 flex justify-center items-center cursor-pointer text-xs gap-1 px-1"
            >
              <>{createElement(FaIcons["FaPlus"], { size: 12 })} </>
              Add new file
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">Brak danych</p>
      )}

      {openNewFileDialog && (
        <Dialog title={"Add new file"} toggleOpen={setOpenNewFileDialog}>
          <CreateFileComponent
            categoryId={openNewFileDialog}
            closeHandle={setOpenNewFileDialog}
          />
        </Dialog>
      )}
    </div>
  );
};

export default CategoryList;
