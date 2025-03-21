import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

export const getAllAdminComplaints = createAsyncThunk(
  'getAllAdminComplaints ',
  async ({search = '', pageSize = 10, pageNo = 1, body, type}) => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/complaints/all-${type}-complains?search=${search}&&pageSize=${pageSize}&&pageNo=${pageNo}`,
        body,
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

const getAllAdminComplaintListSlice = createSlice({
  name: 'getAdminComplaint',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllAdminComplaints.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllAdminComplaints.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllAdminComplaints.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
      state.data = action.payload;
    });
  },
});

export default getAllAdminComplaintListSlice.reducer;
