import { ClipLoader } from "react-spinners";
import {
  useDocumentById,
  useDocumentList,
  useExtractDocumentData,
} from "../hooks/useDocument";
import { DocumentTable } from "./DocumentTable";
import { useEffect, useState } from "react";
import Dialog from "@/components/dialog";
import CreateCategory from "./CreateCategory";

const TableHandlerComponent = () => {
  const [displayDocument, setDisplayDocument] = useState<string | null>(null);
  const [addCategory, setAddCategory] = useState<boolean>(false);
  const [extractDocument, setExtractDocument] = useState<{
    documentId: string;
    fileId: string;
  } | null>(null);

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

  const {
    data: extractedDocument,
    isLoading: isExtractLoading,
    error: extractError,
    refetch: fetchExtractDocument,
  } = useExtractDocumentData(
    extractDocument?.fileId,
    extractDocument?.documentId
  );

  const handleDisplay = (fileId: string): void => {
    setDisplayDocument(fileId);
    fetchDocument();
  };

  const handleExtractData = (params: {
    fileId: string;
    documentId: string;
  }): void => {
    const { fileId, documentId } = params;
    setExtractDocument({ fileId, documentId });
    // fetchExtractDocument();
  };

  useEffect(() => {
    if (extractDocument?.fileId && extractDocument?.documentId) {
      fetchExtractDocument();
    }
  }, [
    extractDocument?.fileId,
    extractDocument?.documentId,
    fetchExtractDocument,
  ]);

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

  return (
    <div className="w-full max-h-full">
      <DocumentTable
        data={documents}
        handleDisplay={handleDisplay}
        handleExtractData={handleExtractData}
        setAddCategory={setAddCategory}
      />
      {addCategory && (
        <Dialog title={"Add category"} toggleOpen={setAddCategory}>
          <CreateCategory />
        </Dialog>
      )}
    </div>
  );
};

export default TableHandlerComponent;
