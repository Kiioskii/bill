import { useEffect, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";

export const OptionsMenu = ({ rowId, optionsRowId, setOptionsRowId }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOptionsRowId(null);
      }
    }

    if (optionsRowId === rowId) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsRowId, rowId, setOptionsRowId]);

  return (
    <div className="relative ">
      <div
        className="p-1.5 rounded-sm w-fit self-center flex justify-center hover:bg-gray-200 mx-auto"
        onClick={() => {
          setOptionsRowId(rowId);
        }}
      >
        <BsThreeDots />
      </div>
      {optionsRowId === rowId && (
        <div
          ref={menuRef}
          className="absolute z-30 left-12 -bottom-5 mt-2 w-56 rounded-md border bg-white shadow-lg"
        >
          <ul className="py-1 text-sm text-start text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">
              Delete
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
