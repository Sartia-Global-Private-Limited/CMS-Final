/*    ----------------Created Date :: 4 -March -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../config';
import { store } from '../../store';

/ * api for  getting tutorial detail by id  */;
export const getSingleTutorialDetails = createAsyncThunk(
  'getSingleTutorialDetails',
  async type => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/get-single-tutorial-details/${type}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      console.log('data', data);
      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);

const getSingleTutorialDetailSlice = createSlice({
  name: 'getSingleTutorialDetail',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getSingleTutorialDetails.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSingleTutorialDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getSingleTutorialDetails.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSingleTutorialDetailSlice.reducer;
