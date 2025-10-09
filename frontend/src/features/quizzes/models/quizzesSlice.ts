import { createSlice } from "@reduxjs/toolkit";

interface IQuizzesSlice {
  isOpen: boolean;
  fileIds: string[];
  selectedQuestion: number;
  selectedQuiz: any | null;
}

const initialState: IQuizzesSlice = {
  isOpen: false,
  fileIds: [],
  selectedQuestion: 0,
  selectedQuiz: null,
};

const quizzesSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    displayCreatePanel: (state, action) => {
      const display = action.payload;
      state.isOpen = display;
    },
    selectFiles: (state, action) => {
      if (typeof action.payload === "object") {
        state.fileIds.push(...action.payload);
      } else {
        state.fileIds.push(action.payload);
      }
    },
    removeFiles: (state) => {
      state.fileIds = [];
    },
    selectQuiz: (state, action) => {
      state.selectedQuiz = action.payload;
    },
    selectQuestion: (state, action) => {
      state.selectedQuestion = action.payload;
    },
  },
});

export const { displayCreatePanel, selectFiles, removeFiles } =
  quizzesSlice.actions;
export default quizzesSlice.reducer;
