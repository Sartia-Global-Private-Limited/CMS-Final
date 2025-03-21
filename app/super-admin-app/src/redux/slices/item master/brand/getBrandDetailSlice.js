import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting Brand  detail by id  */;
export const getBrandDetailById = createAsyncThunk(
  'getBrandDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/item-master/get-brand-by-id/${id}`,
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
  name: 'getBrandDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getBrandDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getBrandDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getBrandDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getBrandDetailSlice.reducer;
