import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  side: [],
  changed: false,
};

const sidebarModuleSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarModule: (state, action) => {
      state.side = action.payload.sidebarModule;
      state.changed = action.payload.changed;
    },
  },
});

export const { setSidebarModule } = sidebarModuleSlice.actions;

export const selectSidebar = (state) => state.sidebarModule;

export default sidebarModuleSlice.reducer;
