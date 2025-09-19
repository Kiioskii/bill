import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DocumentsState {
  isOpen: boolean;
  selectedFiles: { id: string; name: string }[];
}

const initialState: DocumentsState = {
  isOpen: false,
  selectedFiles: [],
};

const documentsSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    openPanel: (state) => {
      state.isOpen = true;
    },
    closePanel: (state) => {
      state.isOpen = false;
      state.selectedFiles = [];
    },
    togglePanel: (state) => {
      state.isOpen = !state.isOpen;
    },
    addFile: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.isOpen = true;
      const file = action.payload;
      const exists = state.selectedFiles.some((f) => f.id === file.id);
      if (!exists) {
        state.selectedFiles.push(file);
      }
    },
    removeFile: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const file = action.payload;
      const exists = state.selectedFiles.some((f) => f.id === file.id);
      if (exists) {
        state.selectedFiles = state.selectedFiles.filter(
          (item) => item.id !== file.id
        );
      }
      if (state.selectedFiles.length === 0) state.isOpen = false;
    },
  },
});

export const { openPanel, closePanel, togglePanel, addFile, removeFile } =
  documentsSlice.actions;
export default documentsSlice.reducer;
