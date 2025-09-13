import TableComponent from "@/components/table-component";
import { createColumnHelper } from "@tanstack/react-table";
import { useDocumentList } from "../hooks/useDocumentList";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";
import { FaRegCircleDot } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const columnHelper = createColumnHelper();
const getColumns = (color) => {
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
        />
      ),
      size: 40,
    },
    columnHelper.accessor("name", {
      cell: (info) => (
        <span className="flex items-center gap-2 ">
          <div className="p-1 rounded-md hover:bg-gray-100 cursor-pointer">
            <FaRegCircleDot className={cn("", color && `text-${color}`)} />
          </div>
          <div className={cn("cursor-pointer", color && `hover:text-${color}`)}>
            {info.getValue()}
          </div>
        </span>
      ),
      size: 50,
      minSize: 50,
      maxSize: 200,
    }),
    columnHelper.accessor("filename", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("createdAt", {
      cell: (info) => info.getValue(),
    }),
  ];
};

const DocumentsByCategoryTable = ({ categoryId, color }) => {
  const columns = getColumns(color);

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
