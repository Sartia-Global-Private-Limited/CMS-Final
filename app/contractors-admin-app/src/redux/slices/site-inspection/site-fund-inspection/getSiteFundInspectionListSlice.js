/*    ----------------Created Date :: 20 -May -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting pending site fund inspection list  */;
export const getPendingSiteFundInspection = createAsyncThunk(
  'getPendingSiteFundInspection ',
  async ({search, pageSize, pageNo, outletId, RoId, SaId}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-pending-site-complaints-for-funds?outlet_id=${
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

/ * api for  getting partial site fund inspection  list  */;
export const getPartialSiteFundInspection = createAsyncThunk(
  'getPartialSiteFundInspection ',
  async ({search, pageSize, pageNo, outletId, RoId, SaId}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-partial-site-complaints-for-funds?outlet_id=${
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

/ * api for  getting approved site fund inspection  list  */;
export const getApprovedSiteFundInspection = createAsyncThunk(
  'getApprovedSiteFundInspection ',
  async ({search, pageSize, pageNo, outletId, RoId, SaId}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-approved-site-complaints-for-funds?outlet_id=${
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

const getSiteFundInspectionListSlice = createSlice({
  name: 'getSiteFundInspectionList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending  site fund inspection*/
    builder.addCase(getPendingSiteFundInspection.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPendingSiteFundInspection.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPendingSiteFundInspection.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
    /*for partial  site fund inspection*/
    builder.addCase(getPartialSiteFundInspection.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPartialSiteFundInspection.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPartialSiteFundInspection.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for approved site fund inspection*/
    builder.addCase(getApprovedSiteFundInspection.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      getApprovedSiteFundInspection.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(getApprovedSiteFundInspection.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSiteFundInspectionListSlice.reducer;
