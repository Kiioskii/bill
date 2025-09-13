import api from "@/api/api";
import type {
  CreateDocumentPayload,
  DocumentPage,
  UUID,
} from "../types/Documents";

/**
 * Sends a GET request to retrieve a paginated list of documents.
 *
 * @param index - The starting index for pagination.
 * @param cursor - The maximum number of documents to retrieve.
 * @returns A promise that resolves with the response data containing the list of documents.
 */
export const listDocumentsByCategoryRequest = async (
  categoryId: UUID,
  limit = 50,
  cursor: string | null = null
): Promise<DocumentPage> => {
  const response = await api.get("documents/listByCategory", {
    params: { categoryId, cursor, limit },
  });

  return response.data;
};

export const getDocumentByIdRequest = async (fileId: string) => {
  /**
   * Sends a GET request to retrieve a document by its ID.
   *
   * @param fileId - The unique identifier of the document to fetch.
   * @returns A promise that resolves with the server response containing the document data.
   */
  const response = await api.get("documents/getById", {
    params: { fileId },
  });

  return response.data;
};

export const extractDocumentRequest = async (params: {
  fileId: string;
  documentId: string;
}) => {
  /**
   * Sends a GET request to retrieve a document by its ID.
   *
   * @param fileId - The unique identifier of the document to fetch.
   * @returns A promise that resolves with the server response containing the document data.
   */

  const { fileId, documentId } = params;
  const response = await api.get("documents/extractData", {
    params: { fileId, documentId },
  });

  return response.data;
};

export const addDocumentRequest = async (
  data: CreateDocumentPayload
): Promise<string | Error> => {
  const formedData = new FormData();
  formedData.append("name", data.name);
  formedData.append("categoryId", data.categoryId);
  formedData.append("file", data.file);

  const response = await api.post("documents/upload", formedData);
  return response.data;
};
