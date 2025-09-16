import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { useAppSelector } from "@/app/store";
import DocumentsPanel from "@/features/documents/components/DocumentsPanel";

export const HomePage = () => {
  const isOpen = useAppSelector((state) => state.documents.isOpen);

  return (
    <div>
      <ChartAreaInteractive />
      {isOpen && <DocumentsPanel />}
    </div>
  );
};
