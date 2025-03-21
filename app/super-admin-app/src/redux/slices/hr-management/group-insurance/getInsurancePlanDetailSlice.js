/*    ----------------Created Date :: 2-Feb -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting single insurance plan detail by isnurance plan id */;

export const getInsurancePlanDetail = createAsyncThunk(
  'getInsurancePlanDetail ',
  async ({planId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/payroll/group-insurance/get-single-insurance-plan-details/${planId}`,
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

const getInsurancePlanDetailSlice = createSlice({
  name: 'getInsurancePlanDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getInsurancePlanDetail.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getInsurancePlanDetail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getInsurancePlanDetail.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getInsurancePlanDetailSlice.reducer;
