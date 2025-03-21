import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting Bill formats  detail by id  */;
export const getBillFormatDetailById = createAsyncThunk(
  'getBillFormatDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/master-data/bill-format/get-invoice-number-format-details/${id}`,
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

const getBillFormatDetailSlice = createSlice({
  name: 'getBillFormatDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getBillFormatDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getBillFormatDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getBillFormatDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getBillFormatDetailSlice.reducer;
