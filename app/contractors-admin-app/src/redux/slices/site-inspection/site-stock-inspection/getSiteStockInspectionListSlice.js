/*    ----------------Created Date :: 18 -May -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/ * api for  getting pending site stock inspection list  */;
export const getPendingSiteStockInspection = createAsyncThunk(
  'getPendingSiteStockInspection ',
  async ({ search, pageSize, pageNo, outletId, RoId, SaId }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/site-inspection/get-all-site-inspections?outlet_id=${
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

/ * api for  getting partial site stock inspection  list  */;
export const getPartialSiteStockInspection = createAsyncThunk(
  'getPartialSiteStockInspection',
  async ({ search, pageSize, pageNo, outletId, RoId, SaId }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/site-inspection/get-partial-site-inspections?outlet_id=${
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

/ * api for  getting approved site stock inspection  list  */;
export const getApprovedSiteStockInspection = createAsyncThunk(
  'getApprovedSiteStockInspection ',
  async ({ search, pageSize, pageNo, outletId, RoId, SaId }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/site-inspection/get-approved-site-inspections?outlet_id=${
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

const getSiteStockInspectionListSlice = createSlice({
  name: 'getSiteStockInspectionList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending  site stock inspection*/
    builder.addCase(getPendingSiteStockInspection.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      getPendingSiteStockInspection.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(getPendingSiteStockInspection.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
    /*for partial  site stock inspection*/
    builder.addCase(getPartialSiteStockInspection.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      getPartialSiteStockInspection.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(getPartialSiteStockInspection.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for approved site stock inspection*/
    builder.addCase(getApprovedSiteStockInspection.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      getApprovedSiteStockInspection.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getApprovedSiteStockInspection.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getSiteStockInspectionListSlice.reducer;
