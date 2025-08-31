import { createSlice } from "@reduxjs/toolkit";

interface SheetState {
  isOpen: boolean;
}

const initialState: SheetState = {
  isOpen: false,
};

const sheetSlice = createSlice({
  name: "sheet",
  initialState,
  reducers: {
    openSheet: (state) => {
      state.isOpen = true;
    },
    closeSheet: (state) => {
      state.isOpen = false;
    },
    toggleSheet: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openSheet, closeSheet, toggleSheet } = sheetSlice.actions;
export default sheetSlice.reducer;
