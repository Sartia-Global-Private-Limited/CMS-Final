/*    ----------------Created Date :: 3 -Julu -2024   ----------------- */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/*-------api for getiing  detail of performa invoic by id----------*/
export const getInvoiceDetailById = createAsyncThunk(
  'getInvoiceDetailById',
  async Id => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-single-invoice-details/${Id}`,
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

const getInvoiceDetailSlice = createSlice({
  name: 'getInvoiceDetail',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getInvoiceDetailById.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getInvoiceDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action?.payload;
    });

    builder.addCase(getInvoiceDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getInvoiceDetailSlice.reducer;
