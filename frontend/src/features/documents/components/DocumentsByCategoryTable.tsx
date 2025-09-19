import TableComponent from "@/components/table-component";
import { createColumnHelper } from "@tanstack/react-table";
import { useDocumentList } from "../hooks/useDocumentList";
import { Skeleton } from "@/components/ui/skeleton";
import { FaRegCircleDot } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useEditDocument } from "../hooks/useEditDocument";
import { showToast } from "@/lib/toast";
import { FaPencilAlt } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { LuNotebookPen } from "react-icons/lu";
import { FaQuestion } from "react-icons/fa6";
import { OptionsMenu } from "./OptionsMenu";
import { useAppDispatch } from "@/app/store";
import { addFile, removeFile } from "../model/documentsSlice";
const columnHelper = createColumnHelper();
const getColumns = (
  color: string,
  editNameHandler: string,
  editingRowId,
  setEditingRowId,
  editingValue,
  setEditingValue,
  optionsRowId,
  setOptionsRowId,
  hoverRowId,
  dispatch
) => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        const id = row.original.id;
        const name = row.original.name;
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
              if (value) {
                dispatch(addFile({ id, name }));
              } else {
                dispatch(removeFile({ id, name }));
              }
            }}
            aria-label="Select row"
            className={cn(
              "data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 data-[state=checked]:text-white"
            )}
          />
        );
      },
      size: 20,
    },
    columnHelper.accessor("name", {
      cell: (info) => {
        const rowId = info.row.id;
        const dbRowId = info.row.original.id;
        const value = info.getValue();

        return (
          <span className="flex items-center gap-2 ">
            <div className="p-1 rounded-md hover:bg-gray-100 cursor-pointer">
              <FaRegCircleDot className={cn("", color && `text-${color}`)} />
            </div>
            {rowId === editingRowId ? (
              <input
                className="focus:ring-0 focus:text-indigo-500 outline-none w-full "
                value={editingValue}
                autoFocus
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={() => {
                  editNameHandler(dbRowId, editingValue);
                  setEditingRowId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    editNameHandler(dbRowId, editingValue);
                    setEditingRowId(null);
                  }
                  if (e.key === "Escape") {
                    setEditingRowId(null);
                  }
                }}
              />
            ) : (
              <div
                className={cn(
                  "w-full cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis",
                  rowId === hoverRowId && `hover:text-indigo-500`
                )}
              >
                <p>{value}</p>
              </div>
            )}
            {rowId === hoverRowId && !editingRowId && (
              <div
                onClick={() => {
                  setEditingRowId(rowId);
                  setEditingValue(value);
                }}
                className="border rounded-sm hover:bg-gray-100 h-6 w-7 bg-white flex items-center justify-center shadow text-gray-400"
              >
                <FaPencilAlt size={12} />
              </div>
            )}
          </span>
        );
      },
      size: 100,
    }),
    columnHelper.accessor("filename", {
      cell: (info) => info.getValue(),
      size: 50,
    }),
    columnHelper.accessor("note", {
      cell: (info) => (
        <div className="p-1 rounded-sm w-fit flex flex-row gap-2 justify-between items-center hover:bg-gray-200 mx-auto">
          <LuNotebookPen /> Create notes
        </div>
      ),
      meta: { className: "text-center  justify-center " },
      size: 50,
    }),
    columnHelper.accessor("options", {
      header: (info) => (
        <div className="w-full flex justify-center">
          <CiCirclePlus size={20} className="font-extrabold" />
        </div>
      ),
      cell: (info) => {
        const rowId = info.row.id;

        return (
          <OptionsMenu
            rowId={rowId}
            optionsRowId={optionsRowId}
            setOptionsRowId={setOptionsRowId}
          />
        );
      },
      meta: { className: "text-center  justify-center " },
      enableSorting: false,
      size: 10,
    }),
    columnHelper.accessor("createdAt", {
      cell: (info) => (
        <div>{new Date(info.getValue()).toLocaleString("pl-PL")}</div>
      ),
      // size: 30,
    }),
  ];
};

const DocumentsByCategoryTable = ({
  categoryId,
  color,
}: {
  categoryId: string;
  color: string;
}) => {
  const dispatch = useAppDispatch();
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const [optionsRowId, setOptionsRowId] = useState<string | null>(null);
  const [hoverRowId, setHoverRowId] = useState(false);

  const { mutate: editDocument } = useEditDocument();

  const editNameHandler = (documentId: string, newName: string) => {
    if (!newName.trim()) {
      showToast("Name can not be empty", "error");
      return;
    }
    editDocument({
      documentId,
      column: "name",
      value: newName,
    });
  };

  const columns = getColumns(
    color,
    editNameHandler,
    editingRowId,
    setEditingRowId,
    editingValue,
    setEditingValue,
    optionsRowId,
    setOptionsRowId,
    hoverRowId,
    dispatch
  );

  const { data, error, isFetching, fetchNextPage, hasNextPage } =
    useDocumentList(categoryId);

  const documents = data?.pages.flatMap((page) => page) ?? [];

  return (
    <div>
      {isFetching ? (
        <div className="flex items-center space-x-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ) : (
        <TableComponent
          columns={columns}
          data={documents}
          color={color}
          hoverRow={setHoverRowId}
        />
      )}
    </div>
  );
};

export default DocumentsByCategoryTable;
