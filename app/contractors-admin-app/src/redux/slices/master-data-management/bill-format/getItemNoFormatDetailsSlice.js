import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for  getting ItemNo formats  detail by id  */;
export const getItemNoFormatDetailById = createAsyncThunk(
  'getItemNoFormatDetailById ',
  async id => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/master-data/item-format/get-item-number-format-details/${id}`,
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

const getItemNoFormatDetailSlice = createSlice({
  name: 'getItemNoFormatDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getItemNoFormatDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getItemNoFormatDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getItemNoFormatDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getItemNoFormatDetailSlice.reducer;
