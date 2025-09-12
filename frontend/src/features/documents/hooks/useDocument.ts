import { useQuery } from "@tanstack/react-query";
import {
  extractDocumentRequest,
  getDocumentByIdRequest,
  // listDocumentsByCategoryRequest,
  // listDocumentsRequest,
} from "../api/documentsApi";

// /**
//  * Custom hook to fetch a paginated list of documents.
//  *
//  * @param index - The starting index for pagination (default is 0).
//  * @param limit - The maximum number of documents to fetch (default is 10).
//  * @returns An object containing the fetched data, any error encountered, and the loading state.
//  *
//  * @example
//  * const { data, error, isLoading } = useDocumentList(0, 20);
//  */
// export const useDocumentList = (index: number = 0, limit: number = 10) => {
//   const { data, error, isLoading } = useQuery({
//     queryKey: ["documents_list", index, limit],
//     queryFn: async () => listDocumentsByCategoryRequest(index, limit),
//   });

//   return { data, error, isLoading };
// };

/**
 * Custom React hook to fetch a document by its ID using React Query.
 *
 * @param fileId - The unique identifier of the document to fetch. If `undefined` or `null`, the query will not run.
 * @param options - Optional configuration object.
 * @param options.enabled - If `true`, enables the query; defaults to `true` if not specified.
 * @returns An object containing:
 *   - `data`: The fetched document data, or `null` if not found.
 *   - `error`: Any error encountered during the fetch.
 *   - `isLoading`: Boolean indicating if the query is currently loading.
 *   - `refetch`: Function to manually refetch the document.
 */
export const useDocumentById = (
  fileId?: string | null,
  options?: { enabled?: boolean }
) => {
  const isEnabled = !!fileId && (options?.enabled ?? true);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["documents_by_id", fileId],
    queryFn: async () => {
      if (!fileId) return null; // guard
      return await getDocumentByIdRequest(fileId);
    },
    enabled: isEnabled,
  });

  return { data, error, isLoading, refetch };
};

export const useExtractDocumentData = (
  fileId?: string | null,
  documentId?: string | null
) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["extract_document", fileId, documentId],
    queryFn: async () => {
      if (!fileId || !documentId) return null; // guard
      return await extractDocumentRequest({ fileId, documentId });
    },
    enabled: false,
  });

  return { data, error, isLoading, refetch };
};
