import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/ * api for  getting pending fund Transfer  list  */;
export const getPendingFTList = createAsyncThunk(
  'getPendingFTList ',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/fund/fund-transfer/get-pending-transfer-fund?search=${
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

/ * api for  getting Rescheduled Fund Transfer list  */;
export const getRescheduledFTList = createAsyncThunk(
  'getRescheduledFTList ',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/fund/fund-transfer/rescheduled-transfer-fund?search=${
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

/ * api for  getting Transfered Fund  list  */;
export const getTransferedFTList = createAsyncThunk(
  'getTransferedFTList ',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/fund/fund-transfer/get-transfer-fund?search=${
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

/ * api for  getting all Fund Transfer list  */;
export const getAllFTList = createAsyncThunk(
  'getAllFTList ',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/fund/fund-transfer/get-all-transfer-fund?search=${
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

const getFundTransferListSlice = createSlice({
  name: 'getFundTransferList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending Fund Transfer*/
    builder.addCase(getPendingFTList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPendingFTList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPendingFTList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for Rescheduled Fund Transfer*/
    builder.addCase(getRescheduledFTList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getRescheduledFTList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getRescheduledFTList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for Transfered Fund Transfer*/
    builder.addCase(getTransferedFTList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getTransferedFTList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getTransferedFTList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for all Fund Transfer*/
    builder.addCase(getAllFTList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllFTList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllFTList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getFundTransferListSlice.reducer;
