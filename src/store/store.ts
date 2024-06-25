import { configureStore } from "@reduxjs/toolkit";
import campaignReducer from "./features/campaigns/campaignSlice";
import facebookReducer from "./features/admin/facebookSlice";
import userReducer from "./features/user/userSlice";

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
    facebook: facebookReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
