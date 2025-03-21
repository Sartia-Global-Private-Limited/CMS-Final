import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  userPermission: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserPermission: (state, action) => {
      state.userPermission = action.payload;
    },
  },
});

export const { login, logout, setUser, setUserPermission } = authSlice.actions;

export const selectUser = (state) => state.auth;

export default authSlice.reducer;
