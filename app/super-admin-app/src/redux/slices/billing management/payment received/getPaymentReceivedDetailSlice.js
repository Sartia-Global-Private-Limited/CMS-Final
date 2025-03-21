/*    ----------------Created Date :: 18 - July -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting payment received detail by id   */;
export const getPaymentReceivedDetailById = createAsyncThunk(
  'getPaymentReceivedDetailById ',

  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-payment-received-by-id/${id}`,
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

const getPaymentReceivedDetailSlice = createSlice({
  name: 'getPaymentReceivedDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getPaymentReceivedDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPaymentReceivedDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPaymentReceivedDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getPaymentReceivedDetailSlice.reducer;
