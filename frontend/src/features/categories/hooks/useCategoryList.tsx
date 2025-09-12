import { useQuery } from "@tanstack/react-query";
import type { Category } from "../types/Category";
import { getCategoryListRequest } from "../api/categoriesApi";

export const useCategoryList = (options?: { enabled?: boolean }) => {
  return useQuery<Category[], Error>({
    queryKey: ["get_category_list"],
    queryFn: async () => getCategoryListRequest(),
    staleTime: 30 * 1000,
    refetchInterval: 1000 * 60 * 30,
    enabled: options?.enabled ?? true,
  });
};
