import { showToast } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";
import { addDocumentRequest } from "../api/documentsApi";
import type { CreateDocumentPayload } from "../types/Documents";

export const useCreateDocument = () => {
  return useMutation({
    mutationKey: ["create_document"],
    mutationFn: (data: CreateDocumentPayload) => addDocumentRequest(data),
    onSuccess: () => showToast("Added file successfully", "success"),
    onError: (error) =>
      showToast(`Upload file failed: ${error.message}`, "error"),
  });
};
