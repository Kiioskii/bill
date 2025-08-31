import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  type DragEndEvent,
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import { arrayMove, useSortable } from "@dnd-kit/sortable";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Row,
} from "@tanstack/react-table";
import React from "react";

export function Table<T>({
  data: initialData,
  columns,
  isDraggable = false,
  onDragEnd,
}: DataTableProps<T>) {
  const [data, setData] = React.useState(() => initialData);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Drag & Drop
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    if (!isDraggable || !onDragEnd) return;
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = data.findIndex((d) => d.id === active.id);
      const newIndex = data.findIndex((d) => d.id === over.id);
      setData((prev) => arrayMove(prev, oldIndex, newIndex));
      onDragEnd(oldIndex, newIndex);
    }
  }

  const RowComponent = isDraggable
    ? ({ row }: { row: Row<T> }) => {
        const { transform, transition, setNodeRef, isDragging } = useSortable({
          id: (row.original as any).id,
        });
        return (
          <TableRow
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            data-dragging={isDragging}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        );
      }
    : ({ row }: { row: Row<T> }) => (
        <TableRow>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      );

  return (
    <div className="overflow-auto rounded-lg border">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <RowComponent key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}
