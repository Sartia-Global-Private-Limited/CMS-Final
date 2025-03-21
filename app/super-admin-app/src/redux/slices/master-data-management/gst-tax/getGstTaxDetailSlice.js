import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting gst Tax  detail by id  */;
export const getGstTaxDetailById = createAsyncThunk(
  'getGstTaxDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/master-data/tax/get-saved-gst-details/${id}`,
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

const getGstTaxDetailSlice = createSlice({
  name: 'getGstTaxDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getGstTaxDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getGstTaxDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getGstTaxDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getGstTaxDetailSlice.reducer;
