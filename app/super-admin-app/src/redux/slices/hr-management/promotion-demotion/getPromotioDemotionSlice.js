import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting promotion and demotion list  */;

export const getPromotionDemotionList = createAsyncThunk(
  'getPromotionDemotionList ',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/payroll/promotion-demotion/employee-promotion-demotion-get-all-list?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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

const getPromotioDemotionSlice = createSlice({
  name: 'getPromotioDemotion', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getPromotionDemotionList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPromotionDemotionList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPromotionDemotionList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getPromotioDemotionSlice.reducer;
