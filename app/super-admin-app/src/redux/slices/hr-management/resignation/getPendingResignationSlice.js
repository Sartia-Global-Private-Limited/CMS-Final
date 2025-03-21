import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  Pending Resignation    list*/;
export const getPendingResignationList = createAsyncThunk(
  'getPendingResignationList ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/payroll/resignation/get-resignations-pending-request`,
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

const getPendingResignationSlice = createSlice({
  name: 'getPendingResignation', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getPendingResignationList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPendingResignationList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPendingResignationList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getPendingResignationSlice.reducer;
