import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  Approved Resignation    list*/;
export const getApprovedResignationList = createAsyncThunk(
  'getApprovedResignationList ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/payroll/resignation/get-resignations-approved-list`,
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

const getApprovedResignationSlice = createSlice({
  name: 'getApprovedResignation', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getApprovedResignationList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getApprovedResignationList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getApprovedResignationList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getApprovedResignationSlice.reducer;
