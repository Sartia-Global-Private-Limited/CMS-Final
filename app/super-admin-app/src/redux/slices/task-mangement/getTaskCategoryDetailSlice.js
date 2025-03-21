import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting Task Category detail by id  */;
export const getTaskCategoryDetailById = createAsyncThunk(
  'getTaskCategoryDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/task/get-single-task-category/${id}`,
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

const getTaskCategoryDetailSlice = createSlice({
  name: 'getTaskCategoryDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getTaskCategoryDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getTaskCategoryDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getTaskCategoryDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getTaskCategoryDetailSlice.reducer;
