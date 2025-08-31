import { DataTable } from "@/components/data-table";
import { ClipLoader } from "react-spinners";
import { useDocumentList } from "../hooks/useDocument";
import { Table } from "./Table";
import type { ColumnDef } from "@tanstack/react-table";
const DocumentsTable = () => {
  const { data, isLoading, error } = useDocumentList();

  interface Document {
    id: number;
    filename: string;
    userId: string;
    createdAt: string;
  }

  const columns: ColumnDef<Document>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "filename", header: "Filename" },
    { accessorKey: "userId", header: "User ID" },
    { accessorKey: "createdAt", header: "Created At" },
  ];

  if (isLoading) return;
  <div>
    <ClipLoader
      loading={isLoading}
      size={150}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  </div>;
  if (error) return <div>Error: {error}</div>;

  return <Table data={data} columns={columns} />;
};

export default DocumentsTable;
