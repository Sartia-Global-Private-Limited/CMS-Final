/*    ----------------Created Date :: 8- April -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting pending stock Transfer  list  */;
export const getPendingSTList = createAsyncThunk(
  'getPendingSTList ',
  async ({search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-pending-stock-transfer-request?search=${
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

/ * api for  getting Rescheduled Stock Transfer list  */;
export const getRescheduledSTList = createAsyncThunk(
  'getRescheduledSTList ',
  async ({search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-reschdule-transfer-stock?search=${
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

/ * api for  getting Transfered Stock list  */;
export const getTransferedSTList = createAsyncThunk(
  'getTransferedSTList ',
  async ({search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-transfer-stock?search=${
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

/ * api for  getting all Stock Transfer list  */;
export const getAllSTList = createAsyncThunk(
  'getAllSTList ',
  async ({search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-transfer-stock?search=${
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

const getStockTransferListSlice = createSlice({
  name: 'getStockTransferList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending Stock Transfer*/
    builder.addCase(getPendingSTList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPendingSTList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPendingSTList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for Rescheduled Stock Transfer*/
    builder.addCase(getRescheduledSTList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getRescheduledSTList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getRescheduledSTList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for Transfered Stock Transfer*/
    builder.addCase(getTransferedSTList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getTransferedSTList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getTransferedSTList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for all Stock Transfer*/
    builder.addCase(getAllSTList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllSTList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllSTList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getStockTransferListSlice.reducer;
