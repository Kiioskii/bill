import api from "@/api/api";
import type { Category } from "../types/Category";

export const createCategoryRequest = async (category: Category) => {
  console.log("category", category);
  const response = await api.post("categories/create", category);
  return response.data;
};

export const getCategoryListRequest = async (): Promise<Category[]> => {
  const response = await api.get("categories/list");
  return response.data;
};
