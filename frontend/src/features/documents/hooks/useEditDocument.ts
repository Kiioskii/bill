import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EditDocumentData } from "../types/Documents";
import { editDocumentRequest } from "../api/documentsApi";
import { showToast } from "@/lib/toast";

export const useEditDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit_document"],
    mutationFn: (data: EditDocumentData) => editDocumentRequest(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([
        "category_document",
        variables.documentId,
      ]);
      showToast("Data updated successfully", "success");
    },
    onError: (error: Error) => {
      // console.log("  edit error", error);
      showToast(error.message, "error");
    },
  });
};
