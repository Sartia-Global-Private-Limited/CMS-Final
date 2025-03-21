/*    ----------------Created Date :: 18 -May -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting pending site stock inspection Detail  */;
export const getPendingSiteStockInspectionDetail = createAsyncThunk(
  'getPendingSiteStockInspectionDetail ',
  async ({outletId, month}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-site-inspections-by-id/${
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

/ * api for  getting partial site stock inspection Detail  */;
export const getPartialSiteStockInspectionDetail = createAsyncThunk(
  'getPartialSiteStockInspectionDetail ',
  async ({outletId, month}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-site-inspections-partial-by-id/${
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

/ * api for  getting approved site stock inspection detail   */;
export const getApprovedSiteStockInspectionDetail = createAsyncThunk(
  'getApprovedSiteStockInspectionDetail ',
  async ({outletId, month}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-site-inspections-approved-by-id/${
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

const getSiteStockInspectionDetailSlice = createSlice({
  name: 'getSiteStockInspectionDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending  site stock inspection detail*/
    builder.addCase(
      getPendingSiteStockInspectionDetail.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getPendingSiteStockInspectionDetail.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getPendingSiteStockInspectionDetail.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
    /*for partial  site stock inspection detail*/
    builder.addCase(
      getPartialSiteStockInspectionDetail.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getPartialSiteStockInspectionDetail.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getPartialSiteStockInspectionDetail.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );

    /*for approved site stock inspection detail*/
    builder.addCase(
      getApprovedSiteStockInspectionDetail.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getApprovedSiteStockInspectionDetail.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getApprovedSiteStockInspectionDetail.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getSiteStockInspectionDetailSlice.reducer;
