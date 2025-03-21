import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  allMenus: [],
  activeSubTab: null,
  activeTab: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // logout: state => {
    //   state.user = null;
    //   state.isAuthenticated = false;
    // },
    logout: () => initialState,
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAllMenus: (state, action) => {
      state.allMenus = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setActiveSubTab: (state, action) => {
      state.activeSubTab = action.payload;
    },
  },
});

export const {
  login,
  logout,
  setUser,
  setAllMenus,
  setActiveTab,
  setActiveSubTab,
} = authSlice.actions;

export const selectUser = state => state.auth;

export default authSlice.reducer;
