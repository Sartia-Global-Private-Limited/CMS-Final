/*    ----------------Created Date :: 19- Oct -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting  payment   list */;
export const getAllPaymentList = createAsyncThunk(
  'getAllPaymentList ',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/payment/get-all-invoice-in-payments?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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

const getPaymentUpdateListSlice = createSlice({
  name: 'getPaymentUpdateList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllPaymentList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllPaymentList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllPaymentList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getPaymentUpdateListSlice.reducer;
