/*    ----------------Created Date :: 26- Feb -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting quotation detail by id   */;
export const getQuotationDetailById = createAsyncThunk(
  'getQuotationDetailById ',

  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/quotations/get-quotation-by-id/${id}`,
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

const getQuotationDetailSlice = createSlice({
  name: 'getQuotationDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getQuotationDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getQuotationDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getQuotationDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getQuotationDetailSlice.reducer;
