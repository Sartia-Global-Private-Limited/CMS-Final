/*    ----------------Created Date :: 7-August -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../config';
import { store } from '../../store';

/ * api for  getting feedback  detail by id  */;
export const getFeedbackDetailById = createAsyncThunk(
  'getFeedbackDetailById ',
  async id => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/feedback-suggestion/get-feedback-and-complaint/${id}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);

const getFeedbackDetailSlice = createSlice({
  name: 'getFeedbackDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getFeedbackDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getFeedbackDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getFeedbackDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getFeedbackDetailSlice.reducer;
