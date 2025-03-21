/*    ----------------Created Date :: 23 - Oct -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting retention money detail by id   */;
export const getRetentionMoneyDetailById = createAsyncThunk(
  'getRetentionMoneyDetailById ',

  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-payment-retention-by-id/${id}`,
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

const getRetentionMoneyDetailSlice = createSlice({
  name: 'getRetentionMoneyDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getRetentionMoneyDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getRetentionMoneyDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getRetentionMoneyDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getRetentionMoneyDetailSlice.reducer;
