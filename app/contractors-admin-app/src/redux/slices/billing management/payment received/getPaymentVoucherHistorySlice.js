/*    ----------------Created Date :: 18 - July -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting payment voucher history by id   */;
export const getPaymentVoucherHistoryById = createAsyncThunk(
  'getPaymentVoucherHistoryById ',

  async id => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-payment-history?id=${id || ''}`,
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
