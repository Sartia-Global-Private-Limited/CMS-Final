import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';
/ * api for  Salary Disbursal  */;

export const getSalaryDisbursalList = createAsyncThunk(
  'getSalaryDisbursalList ',
  async ({month, search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/payroll/salary-disbursal/get-salary-disbursal?month=${month}&&search=${
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

const getSalaryDisbursalListSlice = createSlice({
  name: 'getSalaryDisbursalList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getSalaryDisbursalList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSalaryDisbursalList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getSalaryDisbursalList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSalaryDisbursalListSlice.reducer;
