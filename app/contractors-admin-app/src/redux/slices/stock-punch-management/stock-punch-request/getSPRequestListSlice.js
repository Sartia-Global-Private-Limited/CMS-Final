/*    ----------------Created Date :: 22- April -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/* Api for getting All stock punch request*/
export const getAllSPList = createAsyncThunk(
  'getAllSPList',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;

    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/stock-punch/stock-punch-request/get-stock-request-month-wise?search=${
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

const getSPRequestListSlice = createSlice({
  name: 'getSPRequestList',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /* for All  expense list*/
    builder.addCase(getAllSPList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllSPList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllSPList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSPRequestListSlice.reducer;
