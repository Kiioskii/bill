import { useInfiniteQuery } from "@tanstack/react-query";
import type { DocumentPage, UUID } from "../types/Documents";
import { listDocumentsByCategoryRequest } from "../api/documentsApi";

export const useDocumentList = (
  categoryId: UUID,
  opts?: {
    enabled?: boolean;
    pageSize?: number;
  }
) => {
  const pageSize = opts?.pageSize ?? 50;
  return useInfiniteQuery<DocumentPage, Error>({
    queryKey: ["categoryDocument", categoryId],
    queryFn: ({ pageParam = null }) =>
      listDocumentsByCategoryRequest(categoryId, pageSize, pageParam),
    enabled: opts?.enabled ?? true,
    staleTime: 30 * 1000,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firsPage) => firsPage.prevCursor ?? null,
  });
};
