/*    ----------------Created Date :: 17 -May -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting pending office fund inspection Detail  */;
export const getPendingOfficeFundInspectionDetail = createAsyncThunk(
  'getPendingOfficeFundInspectionDetail ',
  async ({outletId, month}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-outlet-with-complaints-funds-by-id/${
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

/ * api for  getting partial office fund inspection Detail  */;
export const getPartialOfficeFundInspectionDetail = createAsyncThunk(
  'getPartialOfficeFundInspectionDetail ',
  async ({outletId, month}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-fund-office-partial-by-id/${
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

/ * api for  getting approved office fund inspection detail   */;
export const getApprovedOfficeFundInspectionDetail = createAsyncThunk(
  'getApprovedOfficeFundInspectionDetail ',
  async ({outletId, month}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-office-approved_fund-by-id/${
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

const getOfficeFundInspectionDetailSlice = createSlice({
  name: 'getOfficeFundInspectionDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending  office fund inspection detail*/
    builder.addCase(
      getPendingOfficeFundInspectionDetail.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getPendingOfficeFundInspectionDetail.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getPendingOfficeFundInspectionDetail.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
    /*for partial  office fund inspection detail*/
    builder.addCase(
      getPartialOfficeFundInspectionDetail.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getPartialOfficeFundInspectionDetail.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getPartialOfficeFundInspectionDetail.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );

    /*for approved office fund inspection detail*/
    builder.addCase(
      getApprovedOfficeFundInspectionDetail.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getApprovedOfficeFundInspectionDetail.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getApprovedOfficeFundInspectionDetail.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getOfficeFundInspectionDetailSlice.reducer;
