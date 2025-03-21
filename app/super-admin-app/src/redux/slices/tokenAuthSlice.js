import {createSlice} from '@reduxjs/toolkit';

const tokenAuthSlice = createSlice({
  name: 'tokenAuth',
  initialState: {
    token: '',
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const {setToken} = tokenAuthSlice.actions;
export const savedToken = state => state.tokenAuth;
export default tokenAuthSlice.reducer;
