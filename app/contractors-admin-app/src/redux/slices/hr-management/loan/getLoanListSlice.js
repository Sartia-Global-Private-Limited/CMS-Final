/*    ----------------Created Date :: 1 - Aug -2024    ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { store } from '../../../store';
import { apiBaseUrl } from '../../../../../config';

/ * api for  Pending loan    list*/;
export const getPendingLoanList = createAsyncThunk(
  'getPendingLoanList ',
  async () => {
    const { token } = store.getState().tokenAuth;

    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/payroll/loan/get-all-loans-pending`,
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

/ * api for getting Active loan    list*/;
export const geActiveLoanList = createAsyncThunk(
  'geActiveLoanList ',
  async () => {
    const { token } = store.getState().tokenAuth;

    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/payroll/loan/get-all-loans-active`,
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
/ * api for getting rejected loan    list*/;
export const getRejectedLoanList = createAsyncThunk(
  'getRejectedLoanList ',
  async () => {
    const { token } = store.getState().tokenAuth;

    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/payroll/loan/get-all-loans-reject`,
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
/ * api for  getting closed loan    list*/;
export const getClosedLoanList = createAsyncThunk(
  'getClosedLoanList ',
  async () => {
    const { token } = store.getState().tokenAuth;

    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/payroll/loan/get-all-loans-closed`,
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

const getLoanListSlice = createSlice({
  name: 'getLoanList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending list*/
    builder.addCase(getPendingLoanList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPendingLoanList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPendingLoanList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for active list*/
    builder.addCase(geActiveLoanList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(geActiveLoanList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(geActiveLoanList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for rejected list*/
    builder.addCase(getRejectedLoanList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getRejectedLoanList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getRejectedLoanList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for closed list*/
    builder.addCase(getClosedLoanList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getClosedLoanList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getClosedLoanList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getLoanListSlice.reducer;
