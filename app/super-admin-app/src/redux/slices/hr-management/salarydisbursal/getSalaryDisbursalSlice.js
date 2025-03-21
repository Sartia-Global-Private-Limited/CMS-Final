import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting Salary Disbursal detail by id */;

export const getSalaryDisbursalDetailById = createAsyncThunk(
  'getSalaryDisbursalDetailById ',
  async ({id, month}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/payroll/salary-disbursal/get-salary-disbursal-details?id=${id}&&month=${month}`,
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

const getSalaryDisbursalSlice = createSlice({
  name: 'getSalaryDisbursalDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getSalaryDisbursalDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSalaryDisbursalDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getSalaryDisbursalDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSalaryDisbursalSlice.reducer;
