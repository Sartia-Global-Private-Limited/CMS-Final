import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting bank  detail by id  */;
export const getBankDetailById = createAsyncThunk(
  'getBankDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/master-data/bank/get-bank-details/${id}`,
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

const getBankDetailSlice = createSlice({
  name: 'getBankDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getBankDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getBankDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getBankDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getBankDetailSlice.reducer;
