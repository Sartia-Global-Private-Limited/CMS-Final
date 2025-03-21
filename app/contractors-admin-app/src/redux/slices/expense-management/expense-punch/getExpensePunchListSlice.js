/*    ----------------Created Date :: 17-April -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/ * api for  getting pending expense punch  list  */;
export const getPendingEPList = createAsyncThunk(
  'getPendingEPList ',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/expense/expense-punch/get-all-expense-punch-list?search=${
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

/ * api for  getting approved expense punch  list  */;
export const getApprovedEPList = createAsyncThunk(
  'getApprovedEPList ',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/expense/expense-punch/get-list-expense-punch-approve?search=${
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

const getExpensePunchListSlice = createSlice({
  name: 'getExpensePunchList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending  expense punch*/
    builder.addCase(getPendingEPList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPendingEPList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPendingEPList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for approved expense punch*/
    builder.addCase(getApprovedEPList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getApprovedEPList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getApprovedEPList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getExpensePunchListSlice.reducer;
