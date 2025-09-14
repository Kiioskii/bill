import { showToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDocumentRequest } from "../api/documentsApi";
import type { CreateDocumentPayload } from "../types/Documents";

export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create_document"],
    mutationFn: (data: CreateDocumentPayload) => addDocumentRequest(data),
    onSuccess: (_, variables) => {
      console.log("variables", variables);
      showToast("Added file successfully", "success");
      queryClient.invalidateQueries({
        queryKey: ["category_document", variables.categoryId],
      });
    },
    onError: (error) =>
      showToast(`Upload file failed: ${error.message}`, "error"),
  });
};
