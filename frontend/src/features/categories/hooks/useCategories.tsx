import { useMutation } from "@tanstack/react-query";
import type { Category } from "../types/Category";
import { createCategoryRequest } from "../api/categoriesApi";
import { showToast } from "@/lib/toast";

export const useCategory = () => {
  const createCategory = useMutation({
    mutationFn: async (category: Category) =>
      await createCategoryRequest(category),
    onSuccess: () => {
      showToast("Created category successfully", "success");
    },
    onError: (error) => {
      showToast(error?.message || "Create category error", "error");
    },
  });

  return { createCategory };
};
