import { configureStore } from "@reduxjs/toolkit";
import campaignReducer from "./features/campaigns/campaignSlice";
import facebookReducer from "./features/admin/facebookSlice";

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
    facebook: facebookReducer,
  },
});
