import api from "@/api/api";

/**
 * Sends a GET request to retrieve a paginated list of documents.
 *
 * @param index - The starting index for pagination.
 * @param limit - The maximum number of documents to retrieve.
 * @returns A promise that resolves with the response data containing the list of documents.
 */
export const listDocumentsRequest = async (index: number, limit: number) => {
  const response = await api.get("documents/list", {
    params: { index, limit },
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
