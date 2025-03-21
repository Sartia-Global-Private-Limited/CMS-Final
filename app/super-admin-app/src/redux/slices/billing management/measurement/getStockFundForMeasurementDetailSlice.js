/*    ----------------Created Date :: 23- Oct -2024   ----------------- */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/*-------api for getiing  stock and fund detail for measurement by complaint id----------*/
export const getStockFundMeasurementByComplaintId = createAsyncThunk(
  'getStockFundMeasurementByComplaintId',
  async comlaint_id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/measurement/get-all-approved-data/${comlaint_id}`,
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

const getStockFundForMeasurementDetailSlice = createSlice({
  name: 'getStockFundForMeasurementDetail',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(
      getStockFundMeasurementByComplaintId.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );

    builder.addCase(
      getStockFundMeasurementByComplaintId.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action?.payload;
      },
    );

    builder.addCase(
      getStockFundMeasurementByComplaintId.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getStockFundForMeasurementDetailSlice.reducer;
