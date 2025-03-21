/*    ----------------Created Date :: 25 -Oct -2024   ----------------- */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/*-------api for getiing  detail of performa invoic by id----------*/

export const getPIDetailById = createAsyncThunk(
  'getPIDetailById',
  async piId => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-single-proforma-invoice/${piId}`,
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

const getPerformaInvoiceDetailSlice = createSlice({
  name: 'getPerformaInvoiceDetail',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getPIDetailById.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getPIDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action?.payload;
    });

    builder.addCase(getPIDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getPerformaInvoiceDetailSlice.reducer;
