import { ClipLoader } from "react-spinners";
import { useDocumentById, useDocumentList } from "../hooks/useDocument";
import { DocumentTable } from "./DocumentTable";
import { useEffect, useState } from "react";

const TableHandlerComponent = () => {
  const [displayDocument, setDisplayDocument] = useState<string | null>(null);

  const {
    data: documents,
    isLoading: isListLoading,
    error: listError,
  } = useDocumentList();

  const {
    data: urlDocument,
    isLoading: isDocLoading,
    error: docError,
    refetch: fetchDocument,
  } = useDocumentById(displayDocument ?? undefined, {
    enabled: !!displayDocument,
  });

  const handleDisplay = (fileId: string): void => {
    console.log("fileId", fileId);
    setDisplayDocument(fileId);
    fetchDocument();
  };

  useEffect(() => {
    if (urlDocument) {
      window.open(urlDocument, "_blank");
    }
  }, [urlDocument]);

  if (isListLoading)
    return (
      <div className="w-full h-full flex  justify-center align-middle">
        <ClipLoader
          loading={isListLoading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  if (listError) return <div>Error: {listError}</div>;

  return <DocumentTable data={documents} handleDisplay={handleDisplay} />;
};

export default TableHandlerComponent;
