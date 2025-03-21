import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting Task Category list  */;
export const getAllTaskCategory = createAsyncThunk(
  'getAllTaskCategory ',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/task/get-all-task-category?search=${
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

const getTaskCategoryListSlice = createSlice({
  name: 'getTaskCategoryList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllTaskCategory.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllTaskCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllTaskCategory.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getTaskCategoryListSlice.reducer;
