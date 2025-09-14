import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

const TableComponent = ({ data, columns, color }) => {
  console.log(color);
  const [rowSelection, setRowSelection] = useState({});

  console.log("rowSelection", rowSelection);

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full h-fit ">
      <thead>
        {table.getHeaderGroups().map((headGroup) => (
          <tr key={headGroup.id} className="border-b">
            {headGroup.headers.map((header) => (
              <th
                key={header.id}
                className="p-2 text-gray-400 capitalize text-start hover:bg-gray-50 cursor-pointer h-5 text-xs "
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
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
                "cursor-pointer transition hover:brightness-95 border-b",
                row.getIsSelected() && `bg-indigo-300/20 border-b-indigo-500` // np. bg-orange-500/30
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 capitalize text-start text-xs">
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
