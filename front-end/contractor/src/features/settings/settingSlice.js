import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dateFormat: "DD-MM-YYYY",
  timeFormat: "HH:mm",
  serverDateFormat: "YYYY-MM-DD",
  logoTitle: "CMS Electricals",
};

const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      state.dateFormat = action.payload.dateFormat;
      state.logoTitle = action.payload.logoTitle;
    },
  },
});

export const { updateSettings } = settingSlice.actions;

export const selectSettings = (state) => state.settings;

export default settingSlice.reducer;
