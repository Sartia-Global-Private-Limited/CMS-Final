/*   ----------------Created Date :: 8 - Dec -2023   ---------------  */

import {createSlice, createAsyncThunk, isAction} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

{
  /* action name  to be called from ui using dispatch */
}

export const getModule = createAsyncThunk('getModule', async requestbody => {
  try {
    const {data} = await customApi.get(`api/super-admin/get-all-module`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

const moduleSlice = createSlice({
  name: 'module', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*  for pending state*/
    builder.addCase(getModule.pending, (state, action) => {
      state.isLoading = true;
    });

    /*  for fulfilled state*/
    builder.addCase(getModule.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });

    /*  for rejected state*/
    builder.addCase(getModule.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default moduleSlice.reducer;
