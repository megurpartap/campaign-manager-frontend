import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentAdAccount: null,
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,

  reducers: {
    setCurrentAdAccount: (state, action) => {
      state.currentAdAccount = action.payload;
    },
    resetCurrentAdAccount: (state) => {
      state.currentAdAccount = null;
    },
  },
});

export const { setCurrentAdAccount, resetCurrentAdAccount } =
  campaignSlice.actions;

export default campaignSlice.reducer;
