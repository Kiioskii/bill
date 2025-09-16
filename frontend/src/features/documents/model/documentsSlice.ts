import { createSlice } from "@reduxjs/toolkit";

interface DocumentsState {
  isOpen: boolean;
}

const initialState: DocumentsState = {
  isOpen: true,
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
    },
    togglePanel: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openPanel, closePanel, togglePanel } = documentsSlice.actions;
export default documentsSlice.reducer;
