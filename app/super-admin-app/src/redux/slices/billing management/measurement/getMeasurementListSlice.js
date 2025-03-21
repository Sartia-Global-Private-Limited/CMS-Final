/*    ----------------Created Date :: 21 -Oct -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting all complaint  list and process to measurement based on status code for measurement */;
export const getMeasurementListOfAllComplaintAndPTM = createAsyncThunk(
  'getMeasurementListOfAllComplaintAndPTM ',
  async ({
    search,
    status,
    pageSize,
    pageNo,
    outletId,
    RoId,
    SaId,
    OrderById,
    companyId,
  }) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/get-resolved-complaint-in-billing?outlet_id=${
          outletId || ''
        }&status=${status || ''}&regional_office_id=${
          RoId || ''
        }&sales_area_id=${SaId || ''}&order_by_id=${OrderById || ''}&search=${
          search || ''
        }&pageSize=${pageSize || ''}&pageNo=${
          pageNo || ''
        }&company_id=${companyId}`,
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

/ * api for  getting list of draft,discard,final and ready to pi measurement */;

export const getMeasurementListOfDraftDiscardFinalReadyToPi = createAsyncThunk(
  'getMeasurementListOfDraftDiscardFinalReadyToPi ',
  async ({
    search,
    status,
    pageSize,
    pageNo,
    outletId,
    RoId,
    SaId,
    OrderById,
    companyId,
  }) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/measurement/get-all-measurements-based-on-status?outlet_id=${
          outletId || ''
        }&&status=${status || ''}&&regional_office_id=${
          RoId || ''
        }&&sales_area_id=${SaId || ''}&&order_by_id=${
          OrderById || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }&company_id=${companyId}`,
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

const getMeasurementListSlice = createSlice({
  name: 'getMeasurementList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for list of all complaint and process to measurement*/
    builder.addCase(
      getMeasurementListOfAllComplaintAndPTM.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getMeasurementListOfAllComplaintAndPTM.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getMeasurementListOfAllComplaintAndPTM.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
    /*for list of draft ,discard,final and ready to pi*/
    builder.addCase(
      getMeasurementListOfDraftDiscardFinalReadyToPi.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getMeasurementListOfDraftDiscardFinalReadyToPi.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getMeasurementListOfDraftDiscardFinalReadyToPi.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getMeasurementListSlice.reducer;
