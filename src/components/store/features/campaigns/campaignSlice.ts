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
  },
});

export const { setCurrentAdAccount } = campaignSlice.actions;

export default campaignSlice.reducer;
