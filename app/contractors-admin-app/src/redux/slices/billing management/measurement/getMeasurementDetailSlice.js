/*    ----------------Created Date :: 11 -June -2024   ----------------- */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/*-------api for getiing  measurement by complaint id----------*/
export const getMeasurementByComplaintId = createAsyncThunk(
  'getMeasurementByComplaintId',
  async comlaint_id => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-measurements-details/${comlaint_id}`,
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
