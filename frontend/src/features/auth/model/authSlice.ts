import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ session: Session | null }>
    ) => {
      console.log("LOGIN action:", action);

      state.user = action.payload.session?.user ?? null;
      state.session = action.payload.session;
      state.accessToken = action.payload.session?.access_token ?? null;
    },
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
