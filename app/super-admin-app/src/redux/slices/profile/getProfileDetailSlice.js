import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting  profile detail  */;
export const getAllProfileDetail = createAsyncThunk(
  'getAllProfileDetail ',
  async () => {
    try {
      const {data} = await customApi.get(`/api/super-admin/profile`);

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);

const getProfileDetailSlice = createSlice({
  name: 'getProfileDetail',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllProfileDetail.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllProfileDetail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllProfileDetail.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getProfileDetailSlice.reducer;
