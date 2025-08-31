import { useQuery } from "@tanstack/react-query";
import { listDocumentsRequest } from "../api/documentsApi";

export const useDocumentList = (index: number = 0, limit: number = 10) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["documents", index, limit],
    queryFn: async () => await listDocumentsRequest(index, limit),
  });

  console.log("data", data);
  console.log("error", error);
  console.log("isLoading", isLoading);

  return { data, error, isLoading };
};
