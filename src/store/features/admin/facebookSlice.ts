import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentConnectedAccount: {
    facebookId: undefined,
    fbFullName: undefined,
  },
  currentFbAccountCampaignPage: {
    facebookId: undefined,
    fbFullName: undefined,
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
        facebookId: undefined,
        fbFullName: undefined,
      };
    },
    setCurrentFbAccountCampaignPage: (state, action) => {
      state.currentFbAccountCampaignPage = action.payload;
    },
    resetCurrentFbAccountCampaignPage: (state) => {
      state.currentFbAccountCampaignPage = {
        facebookId: undefined,
        fbFullName: undefined,
      };
    },
  },
});

export const {
  setCurrentConnectedAccount,
  resetCurrentConnectedAccount,
  setCurrentFbAccountCampaignPage,
  resetCurrentFbAccountCampaignPage,
} = facebookSlice.actions;

export default facebookSlice.reducer;
