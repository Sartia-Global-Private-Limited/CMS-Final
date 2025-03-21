/*    ----------------Created Date :: 17 -May -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting pending office fund inspection list  */;
export const getPendingOfficeFundInspection = createAsyncThunk(
  'getPendingOfficeFundInspection ',
  async ({search, pageSize, pageNo, outletId, RoId, SaId}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-outlet-with-complaints-funds?outlet_id=${
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

/ * api for  getting partial office fund inspection  list  */;
export const getPartialOfficeFundInspection = createAsyncThunk(
  'getPartialOfficeFundInspection ',
  async ({search, pageSize, pageNo, outletId, RoId, SaId}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/fund-office-expense-partial-by-office?outlet_id=${
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

/ * api for  getting approved office fund inspection  list  */;
export const getApprovedOfficeFundInspection = createAsyncThunk(
  'getApprovedOfficeFundInspection ',
  async ({search, pageSize, pageNo, outletId, RoId, SaId}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/fund-office-expense-approved-by-office?outlet_id=${
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

const getOfficeFundInspectionListSlice = createSlice({
  name: 'getOfficeFundInspectionList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending  office fund inspection*/
    builder.addCase(getPendingOfficeFundInspection.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      getPendingOfficeFundInspection.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getPendingOfficeFundInspection.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
    /*for partial  office fund inspection*/
    builder.addCase(getPartialOfficeFundInspection.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      getPartialOfficeFundInspection.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getPartialOfficeFundInspection.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );

    /*for approved office fund inspection*/
    builder.addCase(
      getApprovedOfficeFundInspection.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getApprovedOfficeFundInspection.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getApprovedOfficeFundInspection.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getOfficeFundInspectionListSlice.reducer;
