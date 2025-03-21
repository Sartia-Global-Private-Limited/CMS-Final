/*    ----------------Created Date :: 24- April -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/* Api for getting All stock transfer list */
export const getAllSPTransferList = createAsyncThunk(
  'getAllSPTransferList',
  async ({search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;

    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-stock-quantity-transfer?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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

const getSPTransferListSlice = createSlice({
  name: 'getSPTransferList',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllSPTransferList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllSPTransferList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllSPTransferList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSPTransferListSlice.reducer;
