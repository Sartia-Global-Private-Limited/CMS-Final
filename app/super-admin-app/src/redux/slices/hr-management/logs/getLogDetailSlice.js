import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  gettign logs detail by id */;
export const getLogsDetailById = createAsyncThunk(
  'getLogsDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/payroll/employee-logs/get-single-activity-logs/${id}`,
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

const getLogDetailSlice = createSlice({
  name: 'getLogDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getLogsDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getLogsDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getLogsDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getLogDetailSlice.reducer;
