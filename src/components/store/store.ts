import { configureStore } from "@reduxjs/toolkit";
import campaignReducer from "./features/campaigns/campaignSlice";

export const store = configureStore({
  reducer: campaignReducer,
});
