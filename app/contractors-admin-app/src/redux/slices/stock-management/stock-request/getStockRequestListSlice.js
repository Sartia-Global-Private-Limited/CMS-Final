/*    ----------------Created Date :: 1- April -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/* Api for getting Requested stock request*/
export const getRequestedSRList = createAsyncThunk(
  'getRequesteSRList',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;

    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/stock/stock-request/get-all-requested-stock?search=${
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

/* for getting Approved Stock Request*/
export const getApprovedSRList = createAsyncThunk(
  'getApprovedSRList',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/stock/stock-request/get-all-approved-requested-stock?search=${
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

/* Api for getting rejected Stock request*/
export const getRejectedSRList = createAsyncThunk(
  'getRejectedSRList',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/stock/stock-request/get-all-rejected-requested-stock?search=${
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

/* Api for getting all Stock Request*/
export const getAllSRList = createAsyncThunk(
  'getAllSRList',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;

    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/stock/stock-request/get-all-stock-requests?search=${
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

const getStockRequestListSlice = createSlice({
  name: 'getStockRequestList',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /* for pending Stock Request*/
    builder.addCase(getRequestedSRList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getRequestedSRList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getRequestedSRList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /* for Approved Stock Request*/
    builder.addCase(getApprovedSRList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getApprovedSRList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getApprovedSRList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /* for Rejected Stock Request*/
    builder.addCase(getRejectedSRList.pending, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getRejectedSRList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getRejectedSRList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /* for All Stock Request*/
    builder.addCase(getAllSRList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllSRList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllSRList.rejected, (state, action) => {
      state.isError = true;
      state, (isLoading = false);
    });
  },
});

export default getStockRequestListSlice.reducer;
