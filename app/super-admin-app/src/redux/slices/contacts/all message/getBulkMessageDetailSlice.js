import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting message detail by id   */;
export const getBulkMessageDetailById = createAsyncThunk(
  'getBulkMessageDetailById ',

  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-message-by-id/${id}`,
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

const getBulkMessageDetailSlice = createSlice({
  name: 'getBulkMessageDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getBulkMessageDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getBulkMessageDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getBulkMessageDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getBulkMessageDetailSlice.reducer;
