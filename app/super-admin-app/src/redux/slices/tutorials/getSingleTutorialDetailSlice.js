import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting tutorial detail by id  */;
export const getSingleTutorialDetails = createAsyncThunk(
  'getSingleTutorialDetails',
  async type => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-single-tutorial-details/${type}`,
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

const getSingleTutorialDetailSlice = createSlice({
  name: 'getSingleTutorialDetail',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getSingleTutorialDetails.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSingleTutorialDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getSingleTutorialDetails.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSingleTutorialDetailSlice.reducer;
