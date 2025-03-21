/*    ----------------Created Date :: 23 -Oct -2024   ----------------- */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/*-------api for getiing  timeline for measurement by measurement id----------*/
export const getMeasurementTimelineById = createAsyncThunk(
  'getMeasurementTimelineById',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/measurement/get-measurements-timeline-details/${id}`,
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

const getMeasurementTimelineDetailSlice = createSlice({
  name: 'getMeasurementTimelineDetail',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getMeasurementTimelineById.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getMeasurementTimelineById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action?.payload;
    });

    builder.addCase(getMeasurementTimelineById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getMeasurementTimelineDetailSlice.reducer;
