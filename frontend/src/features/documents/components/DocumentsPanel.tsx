import { IoClose } from "react-icons/io5";
import { FaTrashCan } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { FaQuestion } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { closePanel } from "../model/documentsSlice";
import { cn } from "@/lib/utils";

const DocumentsPanel = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.documents.isOpen);
  const selectedFiles = useAppSelector(
    (state) => state.documents.selectedFiles
  );

  return (
    <div
      className={cn(
        "absolute bottom-10 left-1/2 flex flex-row justify-between text-white text-sm -translate-x-1/2 w-4/5 p-2 h-13 border-2 bg-neutral-800 rounded-md",
        isOpen && "translate-y-0 opacity-100",
        "transition-all duration-300 ease-out"
      )}
    >
      <div
        onClick={() => dispatch(closePanel())}
        className="w-fit h-full px-2 flex flex-row items-center justify-between gap-5 border border-gray-600 rounded-md hover:bg-neutral-700 cursor-pointer"
      >
        {selectedFiles.length} File selected <IoClose />
      </div>
      <div className="flex flex-row gap-2">
        <div className="rounded-md flex flex-row  hover:bg-neutral-700 cursor-pointer px-2 gap-2 items-center">
          <FaQuestion />
          Create quiz
        </div>
        <div className="rounded-md flex flex-row  hover:bg-neutral-700 cursor-pointer px-2 gap-2 items-center">
          <LuNotebookPen />
          Create note
        </div>
        <div className="rounded-md hover:bg-neutral-700 cursor-pointer px-2 flex items-center text-red-700 ">
          <FaTrashCan />
        </div>
      </div>
    </div>
  );
};

export default DocumentsPanel;
