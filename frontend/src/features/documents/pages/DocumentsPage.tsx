import { useAppSelector } from "@/app/store";
import DocumentsPanel from "../components/DocumentsPanel";
import TableHandlerComponent from "../components/TableHandlerComponent";

export const DocumentsPage = () => {
  const isOpen = useAppSelector((state) => state.documents.isOpen);

  return (
    <div>
      <TableHandlerComponent />
      {isOpen && <DocumentsPanel />}
    </div>
  );
};
