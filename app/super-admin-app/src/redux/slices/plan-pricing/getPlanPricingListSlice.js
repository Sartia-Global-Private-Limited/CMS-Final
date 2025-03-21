import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting All Plan and pricing  list  */;
export const getAllPlanPrice = createAsyncThunk(
  'getAllPlanPrice ',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/plan/get-all-plans?search=${search || ''}&&pageSize=${
          pageSize || ''
        }&&pageNo=${pageNo || ''}`,
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

const getPlanPricingListSlice = createSlice({
  name: 'getAllQuotationList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllPlanPrice.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllPlanPrice.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllPlanPrice.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getPlanPricingListSlice.reducer;
