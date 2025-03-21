/*    ----------------Created Date :: 14 -May -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting pending office stock inspection list  */;
export const getPendingOfficeStockInspection = createAsyncThunk(
  'getPendingOfficeStockInspection ',
  async ({search, pageSize, pageNo, outletId, RoId, SaId}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-outlet-with-complaints?outlet_id=${
          outletId || ''
        }&&regional_office_id=${RoId || ''}&&sales_area_id=${
          SaId || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }`,
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

/ * api for  getting partial office stock inspection  list  */;
export const getPartialOfficeStockInspection = createAsyncThunk(
  'getPartialOfficeStockInspection ',
  async ({search, pageSize, pageNo, outletId, RoId, SaId}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/stock-office-expense-partial-by-office?outlet_id=${
          outletId || ''
        }&&regional_office_id=${RoId || ''}&&sales_area_id=${
          SaId || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }`,
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

/ * api for  getting approved office stock inspection  list  */;
export const getApprovedOfficeStockInspection = createAsyncThunk(
  'getApprovedOfficeStockInspection ',
  async ({search, pageSize, pageNo, outletId, RoId, SaId}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/stock-office-expense-approved-by-office?outlet_id=${
          outletId || ''
        }&&regional_office_id=${RoId || ''}&&sales_area_id=${
          SaId || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }`,
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

const getOfficeStockInspectionListSlice = createSlice({
  name: 'getOfficeStockInspectionList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending  office stock inspection*/
    builder.addCase(
      getPendingOfficeStockInspection.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getPendingOfficeStockInspection.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getPendingOfficeStockInspection.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
    /*for partial  office stock inspection*/
    builder.addCase(
      getPartialOfficeStockInspection.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getPartialOfficeStockInspection.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getPartialOfficeStockInspection.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );

    /*for approved office stock inspection*/
    builder.addCase(
      getApprovedOfficeStockInspection.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getApprovedOfficeStockInspection.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getApprovedOfficeStockInspection.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getOfficeStockInspectionListSlice.reducer;
