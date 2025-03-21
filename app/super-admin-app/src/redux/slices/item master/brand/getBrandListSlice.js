import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting all brand list */;
export const getAllBrandList = createAsyncThunk(
  'getAllBrandList',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/item-master/get-all-brand?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
      );
      return data;
    } catch (error) {
      return {
        category: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);

const getBrandListSlice = createSlice({
  name: 'getBrandList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllBrandList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllBrandList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllBrandList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getBrandListSlice.reducer;
