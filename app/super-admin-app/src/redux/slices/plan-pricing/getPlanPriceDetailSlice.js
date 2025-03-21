/*    ----------------Created Date :: 27- Feb -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting Plan and price detail by id  */;
export const getPlanPriceDetailById = createAsyncThunk(
  'getPlanPriceDetailById ',
  async Id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/plan/get-plan-details/${Id}`,
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

const getPlanPriceDetailSlice = createSlice({
  name: 'getPlanPriceDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getPlanPriceDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPlanPriceDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPlanPriceDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getPlanPriceDetailSlice.reducer;
