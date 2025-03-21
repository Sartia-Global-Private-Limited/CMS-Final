/*    ----------------Created Date :: 23 -Oct -2024   ----------------- */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/*-------api for getiing  detail of merged performa invoic by id----------*/
export const getMergedPIDetailById = createAsyncThunk(
  'getMergedPIDetailById',
  async piId => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-merged-proforma-invoice/${piId}`,
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
    builder.addCase(getMergedPIDetailById.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getMergedPIDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action?.payload;
    });

    builder.addCase(getMergedPIDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getMeasurementDetailSlice.reducer;
