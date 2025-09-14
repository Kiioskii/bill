import TableComponent from "@/components/table-component";
import { createColumnHelper } from "@tanstack/react-table";
import { useDocumentList } from "../hooks/useDocumentList";
import { Skeleton } from "@/components/ui/skeleton";
import { FaRegCircleDot } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useEditDocument } from "../hooks/useEditDocument";
import { showToast } from "@/lib/toast";

const columnHelper = createColumnHelper();
const getColumns = (
  color,
  editNameHandler,
  editingRowId,
  setEditingRowId,
  editingValue,
  setEditingValue
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
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className={cn(
            "data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 data-[state=checked]:text-white"
          )}
        />
      ),
      size: 40,
    },
    columnHelper.accessor("name", {
      cell: (info) => {
        const rowId = info.row.id;
        const value = info.getValue();

        return (
          <span
            className="flex items-center gap-2 border"
            onClick={() => {
              setEditingRowId(rowId);
              setEditingValue(value);
            }}
          >
            <div className="p-1 rounded-md hover:bg-gray-100 cursor-pointer">
              <FaRegCircleDot className={cn("", color && `text-${color}`)} />
            </div>
            {rowId === editingRowId ? (
              <input
                className="focus:ring-0 focus:text-indigo-500 outline-none w-fit"
                value={editingValue}
                autoFocus
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={() => {
                  editNameHandler(rowId, editingValue);
                  setEditingRowId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    editNameHandler(rowId, editingValue);
                    setEditingRowId(null);
                  }
                  if (e.key === "Escape") {
                    setEditingRowId(null);
                  }
                }}
              />
            ) : (
              <div
                className={cn("cursor-pointer", color && `hover:text-${color}`)}
              >
                {value}
              </div>
            )}
          </span>
        );
      },
      size: 100,
    }),
    columnHelper.accessor("filename", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("createdAt", {
      cell: (info) => (
        <div>{new Date(info.getValue()).toLocaleString("pl-PL")}</div>
      ),
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
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string | null>(null);

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
    setEditingValue
  );

  const { data, error, isFetching, fetchNextPage, hasNextPage } =
    useDocumentList(categoryId);
  const documents = data?.pages.flatMap((page) => page) ?? [];

  console.log("data", data);
  console.log("documents", documents);

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
        <TableComponent columns={columns} data={documents} color={color} />
      )}
    </div>
  );
};

export default DocumentsByCategoryTable;
