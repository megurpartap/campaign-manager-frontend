import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentConnectedAccount: {
    facebookId: null,
    fbFullName: null,
  },
};

const facebookSlice = createSlice({
  name: "facebook",
  initialState,

  reducers: {
    setCurrentConnectedAccount: (state, action) => {
      state.currentConnectedAccount = action.payload;
    },
    resetCurrentConnectedAccount: (state) => {
      state.currentConnectedAccount = {
        facebookId: null,
        fbFullName: null,
      };
    },
  },
});

export const { setCurrentConnectedAccount, resetCurrentConnectedAccount } =
  facebookSlice.actions;

export default facebookSlice.reducer;
