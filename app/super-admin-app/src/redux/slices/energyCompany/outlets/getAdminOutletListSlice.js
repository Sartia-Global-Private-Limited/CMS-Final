import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/* action name  to be called from ui using dispatch */

export const allAdminOutletsList = createAsyncThunk(
  'allAdminOutletsList',
  async ({search, pageSize, pageNo, status}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/outlets/all-outlets?search=${search || ''}&status=${
          status || ''
        }&pageSize=${pageSize || ''}&pageNo=${pageNo || ''}`,
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

const getAdminOutletListSlice = createSlice({
  name: 'allAdminOutlets',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(allAdminOutletsList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(allAdminOutletsList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(allAdminOutletsList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAdminOutletListSlice.reducer;
