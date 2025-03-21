/*    ----------------Created Date :: 25 -June -2024   ----------------- */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/*-------api for getiing  detail of performa invoic by id----------*/
export const getPIDetailById = createAsyncThunk(
  'getPIDetailById',
  async piId => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/billing/performa-invoice/get-single-proforma-invoice/${piId}`,
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
        message: error.response.data.message || error.message,
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
