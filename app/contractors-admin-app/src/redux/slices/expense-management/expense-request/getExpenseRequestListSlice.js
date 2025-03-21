/*    ----------------Created Date :: 15- April -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/* Api for getting All expense request*/
export const getAllExpenseList = createAsyncThunk(
  'getAllExpenseList',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;

    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/expense/expense-request/get-all-expense-request-by-month?search=${
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

const getExpenseRequestListSlice = createSlice({
  name: 'getExpenseRequestList',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /* for All  expense list*/
    builder.addCase(getAllExpenseList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllExpenseList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllExpenseList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getExpenseRequestListSlice.reducer;
