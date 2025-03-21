import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/ * api for  getting requested fund request  list  */;
export const getRequestedFRList = createAsyncThunk(
  'getRequestedFRList ',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/fund/fund-request/get-all-fund-requested?search=${
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

/ * api for  getting approved fund request  list  */;
export const getApprovedFRList = createAsyncThunk(
  'getApprovedFRList ',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/fund/fund-request/get-all-approved-fund-requested?search=${
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

/ * api for  getting rejected fund request  list  */;
export const getRejectedFRList = createAsyncThunk(
  'getRejectedFRList ',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/fund/fund-request/get-all-rejected-fund-requested?search=${
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

const getFundRequestListSlice = createSlice({
  name: 'getFundRequestList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending Fund request*/
    builder.addCase(getRequestedFRList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getRequestedFRList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getRequestedFRList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for apprpved Fund request*/
    builder.addCase(getApprovedFRList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getApprovedFRList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getApprovedFRList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for Rejected Fund request*/
    builder.addCase(getRejectedFRList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getRejectedFRList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getRejectedFRList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getFundRequestListSlice.reducer;
