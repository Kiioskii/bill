import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";

const TableComponent = ({ data, columns, color, hoverRow }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection, sorting },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table className="w-full table-fixed border-collapse">
      <thead>
        {table.getHeaderGroups().map((headGroup) => (
          <tr key={headGroup.id} className="border-b">
            {headGroup.headers.map((header) => (
              <th
                key={header.id}
                style={{ width: header.getSize() }}
                onClick={header.column.getToggleSortingHandler()}
                className={cn(
                  "p-2 text-gray-400 capitalize text-start hover:bg-gray-50 cursor-pointer h-5 text-xs",
                  header.column.columnDef.meta?.className ??
                    `${header.column.columnDef.meta?.className}`
                )}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {header.column.getCanSort() && (
                  <>
                    {header.column.getIsSorted() === "asc" && (
                      <FaSortUp className="inline ml-1" />
                    )}
                    {header.column.getIsSorted() === "desc" && (
                      <FaSortDown className="inline ml-1" />
                    )}
                    {(!header.column.getCanSort() ||
                      !header.column.getIsSorted()) && (
                      <FaSort className="inline ml-1 text-gray-300" />
                    )}
                  </>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          return (
            <tr
              key={row.id}
              className={cn(
                "cursor-pointer transition hover:bg-gray-400/10 border-b ",
                row.getIsSelected() &&
                  `bg-indigo-300/20 hover:bg-indigo-300/30 border-b-indigo-500` // np. bg-orange-500/30
              )}
              onMouseEnter={() => hoverRow(row.id)}
              onMouseLeave={() => hoverRow(false)}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{ width: cell.column.getSize() }}
                  className={cn(
                    "h-8 px-2 capitalize text-start text-xs ",
                    cell.column.columnDef.meta?.className ??
                      `${cell.column.columnDef.meta?.className}`
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TableComponent;
