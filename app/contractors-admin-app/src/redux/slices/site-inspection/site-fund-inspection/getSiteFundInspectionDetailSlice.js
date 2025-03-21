/*    ----------------Created Date :: 20 -May -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting pending site fund inspection Detail  */;
export const getPendingSiteFundInspectionDetail = createAsyncThunk(
  'getPendingSiteFundInspectionDetail ',
  async ({outletId, month}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-pending-site-complaints-for-funds-id/${
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

/ * api for  getting partial site fund inspection Detail  */;
export const getPartialSiteFundInspectionDetail = createAsyncThunk(
  'getPartialSiteFundInspectionDetail ',
  async ({outletId, month}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-partial-site-complaints-for-funds-id/${
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

/ * api for  getting approved site fund inspection detail   */;
export const getApprovedSiteFundInspectionDetail = createAsyncThunk(
  'getApprovedSiteFundInspectionDetail ',
  async ({outletId, month}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-approved-site-complaints-for-funds-id/${
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

const getSiteFundInspectionDetailSlice = createSlice({
  name: 'getSiteFundInspectionDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending  site fund inspection detail*/
    builder.addCase(
      getPendingSiteFundInspectionDetail.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getPendingSiteFundInspectionDetail.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getPendingSiteFundInspectionDetail.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
    /*for partial  site fund inspection detail*/
    builder.addCase(
      getPartialSiteFundInspectionDetail.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getPartialSiteFundInspectionDetail.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getPartialSiteFundInspectionDetail.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );

    /*for approved site fund inspection detail*/
    builder.addCase(
      getApprovedSiteFundInspectionDetail.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getApprovedSiteFundInspectionDetail.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getApprovedSiteFundInspectionDetail.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getSiteFundInspectionDetailSlice.reducer;
