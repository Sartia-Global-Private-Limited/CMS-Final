import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  Rejected Resignation    list*/;
export const getRejectedResignationList = createAsyncThunk(
  'getRejectedResignationList ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/payroll/resignation/get-resignations-rejected-list`,
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

const getRejectedResignationSlice = createSlice({
  name: 'getRejectedResignation', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getRejectedResignationList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getRejectedResignationList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getRejectedResignationList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getRejectedResignationSlice.reducer;
