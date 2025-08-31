import api from "@/api/api";

export const fileSaveRequest = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/documents/upload", formData);

  console.log("response", response);

  return response;
};
