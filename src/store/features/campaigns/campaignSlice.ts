import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentAdAccount: undefined,
  currentAdAccountAdminCampaignPage: undefined,
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,

  reducers: {
    setCurrentAdAccount: (state, action) => {
      state.currentAdAccount = action.payload;
    },
    resetCurrentAdAccount: (state) => {
      state.currentAdAccount = undefined;
    },
    setCurrentAdAccountAdminCampaignPage: (state, action) => {
      state.currentAdAccountAdminCampaignPage = action.payload;
    },
    resetCurrentAdAccountAdminCampaignPage: (state) => {
      state.currentAdAccountAdminCampaignPage = undefined;
    },
  },
});

export const {
  setCurrentAdAccount,
  resetCurrentAdAccount,
  setCurrentAdAccountAdminCampaignPage,
  resetCurrentAdAccountAdminCampaignPage,
} = campaignSlice.actions;

export default campaignSlice.reducer;
