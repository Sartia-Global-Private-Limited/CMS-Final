import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting Brand  detail by id  */;
export const getSubCategoryDetailById = createAsyncThunk(
  'getSubCategoryDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/item-master/get-sub-category-by-id/${id}`,
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

const getBrandDetailSlice = createSlice({
  name: 'getSubCategoryDetail',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getSubCategoryDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSubCategoryDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getSubCategoryDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getBrandDetailSlice.reducer;
