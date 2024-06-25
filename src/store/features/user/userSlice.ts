import { createSlice } from "@reduxjs/toolkit";

type userDataType = {
  username?: string | null;
  role?: "ADMIN" | "USER" | null;
  fullName?: string | null;
};

const initialState: userDataType = {
  username: null,
  role: null,
  fullName: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUserData: (state, action) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.fullName = action.payload.fullName;
    },
    resetUserData: (state) => {
      state.username = null;
      state.role = null;
      state.fullName = null;
    },
  },
});

export const { setUserData, resetUserData } = userSlice.actions;

export default userSlice.reducer;
