import { useAppDispatch } from "@/app/store";
import { useMutation } from "@tanstack/react-query";
import { fileSaveRequest } from "../api/fileApi";
import { showToast } from "@/lib/toast";
import { closeSheet } from "../model/sheetSlice";

export const useFile = () => {
  const dispatch = useAppDispatch();

  const saveFile = useMutation({
    mutationFn: async (file: File) => {
      return await fileSaveRequest(file);
    },
    onSuccess: (data) => {
      console.log("data", data);
      showToast("Successfully saved file", "success");
      dispatch(closeSheet());
    },
    onError: (error: any) => {
      showToast(error?.message || "File error", "error");
    },
  });

  return { saveFile };
};
