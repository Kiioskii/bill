import { createSlice } from "@reduxjs/toolkit";

interface IQuizzesSlice {
  isOpen: boolean;
  fileIds: string[];
}

const initialState: IQuizzesSlice = {
  isOpen: false,
  fileIds: [],
};

const quizzesSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    openCreatePanel: (state, action) => {
      state.isOpen = true;
      state.fileIds = 
    },
    closeCreatePanel: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openCreatePanel, closeCreatePanel } = quizzesSlice.actions;
export default quizzesSlice.reducer;
