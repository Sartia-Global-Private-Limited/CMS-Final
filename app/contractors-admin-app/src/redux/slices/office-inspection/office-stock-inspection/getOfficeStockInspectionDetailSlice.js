/*    ----------------Created Date :: 15 -May -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting pending office stock inspection Detail  */;
export const getPendingOfficeStockInspectionDetail = createAsyncThunk(
  'getPendingOfficeStockInspectionDetail ',
  async ({outletId, month}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-outlet-with-complaints-by-id/${
          outletId || null
        }/${month || ''}`,
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

/ * api for  getting partial office stock inspection Detail  */;
export const getPartialOfficeStockInspectionDetail = createAsyncThunk(
  'getPartialOfficeStockInspectionDetail ',
  async ({outletId, month}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-stock-office-partial-by-id/${
          outletId || null
        }/${month || ''}`,
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

/ * api for  getting approved office stock inspection detail   */;
export const getApprovedOfficeStockInspectionDetail = createAsyncThunk(
  'getApprovedOfficeStockInspectionDetail ',
  async ({outletId, month}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-office-approved-by-id/${
          outletId || null
        }/${month || ''}`,
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

const getOfficeStockInspectionDetailSlice = createSlice({
  name: 'getOfficeStockInspectionDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending  office stock inspection detail*/
    builder.addCase(
      getPendingOfficeStockInspectionDetail.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getPendingOfficeStockInspectionDetail.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getPendingOfficeStockInspectionDetail.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
    /*for partial  office stock inspection detail*/
    builder.addCase(
      getPartialOfficeStockInspectionDetail.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getPartialOfficeStockInspectionDetail.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getPartialOfficeStockInspectionDetail.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );

    /*for approved office stock inspection detail*/
    builder.addCase(
      getApprovedOfficeStockInspectionDetail.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getApprovedOfficeStockInspectionDetail.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getApprovedOfficeStockInspectionDetail.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getOfficeStockInspectionDetailSlice.reducer;
