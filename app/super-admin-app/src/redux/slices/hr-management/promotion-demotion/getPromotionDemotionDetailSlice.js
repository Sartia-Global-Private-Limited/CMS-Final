import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting promotion and demotion detail by id */;

export const getPromotionDemotionDetailById = createAsyncThunk(
  'getPromotionDemotionDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/payroll/promotion-demotion/single-employee-promotion-demotion-details/${id}`,
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

const getPromotionDemotionDetailSlice = createSlice({
  name: 'getPromotionDemotionDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getPromotionDemotionDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      getPromotionDemotionDetailById.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getPromotionDemotionDetailById.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getPromotionDemotionDetailSlice.reducer;
