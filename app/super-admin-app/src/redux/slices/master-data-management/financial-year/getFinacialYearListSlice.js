import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting Finacial year  list  */;
export const getAllFinacialYearList = createAsyncThunk(
  'getAllFinacialYearList',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/master-data/financial-year/fetch-all-financial-years?search=${
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

const getFinacialYearListSlice = createSlice({
  name: 'getFinacialYearList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllFinacialYearList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllFinacialYearList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllFinacialYearList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getFinacialYearListSlice.reducer;
