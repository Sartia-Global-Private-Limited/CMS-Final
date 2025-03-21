/*    ----------------Created Date :: 29 -June -2024   ----------------- */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/*-------api for getiing  timeline for measurement by measurement id----------*/
export const getMeasurementTimelineById = createAsyncThunk(
  'getMeasurementTimelineById',
  async id => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-measurements-timeline-details/${id}`,
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
        message: error.response.data.message || error.message,
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
