import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  uid: string;
  displayName?: string;
}
interface AuthState {
  user: User | null;
}

const initialState: AuthState = { user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (s, a: PayloadAction<User | null>) => { s.user = a.payload; },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
