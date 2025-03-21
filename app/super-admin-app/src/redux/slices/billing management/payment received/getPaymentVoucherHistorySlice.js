/*    ----------------Created Date :: 23 - 10 -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting payment voucher history by id   */;
export const getPaymentVoucherHistoryById = createAsyncThunk(
  'getPaymentVoucherHistoryById ',

  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-payment-history?id=${id || ''}`,
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

const getPaymentVoucherHistorySlice = createSlice({
  name: 'getPaymentVoucherHistory', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getPaymentVoucherHistoryById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPaymentVoucherHistoryById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPaymentVoucherHistoryById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getPaymentVoucherHistorySlice.reducer;
