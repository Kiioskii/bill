import { createSlice } from "@reduxjs/toolkit";

interface TimerData {
  timerId: number;
  time: number;
}
interface IQuizzesSlice {
  isOpen: boolean;
  fileIds: string[];
  timers: Record<string, TimerData>;
}

const initialState: IQuizzesSlice = {
  isOpen: false,
  fileIds: [],
  timers: {},
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
    setTimer: (state, action) => {
      const { quizId, data } = action.payload;
      const { timerId, time } = data;
      state.timers = {
        ...state.timers,
        [quizId]: { timerId, time: time || 0 },
      };
    },
    clearTimer: (state, action) => {
      const { quizId } = action.payload;
      delete state.timers[quizId];
    },
  },
});

export const { displayCreatePanel, selectFiles, removeFiles } =
  quizzesSlice.actions;
export default quizzesSlice.reducer;
