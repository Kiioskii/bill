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
    },
});

export const { displayCreatePanel, selectFiles, removeFiles } = quizzesSlice.actions;
export default quizzesSlice.reducer;
