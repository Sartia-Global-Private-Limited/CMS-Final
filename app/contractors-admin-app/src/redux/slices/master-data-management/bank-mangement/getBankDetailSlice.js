/*    ----------------Created Date :: 6-March -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/ * api for  getting bank  detail by id  */;
export const getBankDetailById = createAsyncThunk(
  'getBankDetailById ',
  async id => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/master-data/bank/get-bank-details/${id}`,
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

const getBankDetailSlice = createSlice({
  name: 'getBankDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getBankDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getBankDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getBankDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getBankDetailSlice.reducer;
