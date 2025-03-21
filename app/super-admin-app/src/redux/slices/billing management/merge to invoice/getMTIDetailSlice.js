/*    ----------------Created Date :: 23 -Oct -2024   ----------------- */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/*-------api for getiing  detail of merged invoice by id----------*/
export const getMergedInvoiceDetailById = createAsyncThunk(
  'getMergedInvoiceDetailById',
  async Id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/merged-performa/get-merged-invoice-by-id/${Id}`,
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

const getMTIDetailSlice = createSlice({
  name: 'getMTIDetail',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getMergedInvoiceDetailById.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getMergedInvoiceDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action?.payload;
    });

    builder.addCase(getMergedInvoiceDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getMTIDetailSlice.reducer;
