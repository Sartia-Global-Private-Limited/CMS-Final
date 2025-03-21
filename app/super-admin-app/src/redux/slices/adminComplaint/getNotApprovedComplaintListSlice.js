import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

export const getAllNotApprovedComplaints = createAsyncThunk(
  'getAllNotApprovedComplaints ',
  async ({search = '', pageSize = 10, pageNo = 1}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/complaints/not-approval-set-complaint?search=${search}&&pageSize=${pageSize}&&pageNo=${pageNo}`,
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

const getNotApprovedComplaintListSlice = createSlice({
  name: 'getNotApprovedComplaint',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllNotApprovedComplaints.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllNotApprovedComplaints.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllNotApprovedComplaints.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
      state.data = action.payload;
    });
  },
});

export default getNotApprovedComplaintListSlice.reducer;
