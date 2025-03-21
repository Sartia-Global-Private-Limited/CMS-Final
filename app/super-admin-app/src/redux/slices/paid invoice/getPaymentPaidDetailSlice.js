import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting payment paid detail by id  */;
export const getpaymentPaidDetailById = createAsyncThunk(
  'getpaymentPaidDetailById ',
  async Id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-payment-paid-by-id/${Id}`,
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

const getPaymentPaidDetailSlice = createSlice({
  name: 'getPaymentPaidDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getpaymentPaidDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getpaymentPaidDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getpaymentPaidDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getPaymentPaidDetailSlice.reducer;
