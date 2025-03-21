/*    ----------------Created Date :: 10 -July -2024   ----------------- */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/*-------api for getiing  detail of merged invoice by id----------*/
export const getMergedInvoiceDetailById = createAsyncThunk(
  'getMergedInvoiceDetailById',
  async Id => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-merged-invoice-by-id/${Id}`,
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
