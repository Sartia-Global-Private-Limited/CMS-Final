import {createSlice} from '@reduxjs/toolkit';

const getDarkModeSlice = createSlice({
  name: 'getDarkMode', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isDarkMode: false,
  },
  reducers: {
    toggleDarkMode: state => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});
export const {toggleDarkMode} = getDarkModeSlice.actions;
export default getDarkModeSlice.reducer;
