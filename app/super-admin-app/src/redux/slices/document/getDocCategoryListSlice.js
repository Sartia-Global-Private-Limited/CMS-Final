/*    ----------------Created Date :: 22- Oct -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting document category  list  */;
export const getDocCategory = createAsyncThunk(
  'getDocCategory ',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-document-categories?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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

const getDocCategoryListSlice = createSlice({
  name: 'getDocCategoryList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getDocCategory.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getDocCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getDocCategory.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getDocCategoryListSlice.reducer;
