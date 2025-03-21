/*    ----------------Created Date :: 22- oct -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting document category detail by id  */;
export const getDocCategoryDetailById = createAsyncThunk(
  'getDocCategoryDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-document-category-details/${id}`,
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

const getDocCategoryDetailSlice = createSlice({
  name: 'getDocCategoryDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getDocCategoryDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getDocCategoryDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getDocCategoryDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getDocCategoryDetailSlice.reducer;
