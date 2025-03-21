import {createSlice} from '@reduxjs/toolkit';

const getLanguageSlice = createSlice({
  name: 'getLanguage', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isEnglish: true,
  },
  reducers: {
    toggleLanguage: state => {
      state.isEnglish = !state.isEnglish;
    },
  },
});
export const {toggleLanguage} = getLanguageSlice.actions;
export default getLanguageSlice.reducer;
