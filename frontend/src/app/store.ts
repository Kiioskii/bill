import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import authReducer from "@/features/auth/model/authSlice";
import sheetReducer from "@/features/dashboard/model/sheetSlice";
import documentsReducer from "@/features/documents/model/documentsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sheet: sheetReducer,
    documents: documentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
