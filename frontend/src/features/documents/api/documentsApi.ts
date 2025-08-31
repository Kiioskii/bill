import api from "@/api/api";

export const listDocumentsRequest = async (index: number, limit: number) => {
  const response = await api.get("documents/list", {
    params: { index, limit },
  });
  return response.data;
};
