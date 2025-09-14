import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Category } from "../types/Category";
import { createCategoryRequest } from "../api/categoriesApi";
import { showToast } from "@/lib/toast";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Category) =>
      await createCategoryRequest(category),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["get_category_list", variables.id],
      });
      showToast("Created category successfully", "success");
    },
    onError: (error) => {
      showToast(error?.message || "Create category error", "error");
    },
  });
};
