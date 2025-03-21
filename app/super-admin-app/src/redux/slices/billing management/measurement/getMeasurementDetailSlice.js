/*    ----------------Created Date :: 23 -Oct -2024   ----------------- */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/*-------api for getiing  measurement by complaint id----------*/
export const getMeasurementByComplaintId = createAsyncThunk(
  'getMeasurementByComplaintId',
  async comlaint_id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/measurement/get-measurements-details/${comlaint_id}`,
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

const getMeasurementDetailSlice = createSlice({
  name: 'getMeasurementDetail',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getMeasurementByComplaintId.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getMeasurementByComplaintId.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action?.payload;
    });

    builder.addCase(getMeasurementByComplaintId.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getMeasurementDetailSlice.reducer;
