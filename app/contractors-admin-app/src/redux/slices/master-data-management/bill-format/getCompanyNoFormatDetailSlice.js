import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for  getting CompanyNo formats  detail by id  */;
export const getCompanyNoFormatDetailById = createAsyncThunk(
  'getCompanyNoFormatDetailById',
  async id => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/master-data/client-vendor-format/get-client-vendor-number-format-details/${id}`,
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

const getCompanyNoFormatDetailSlice = createSlice({
  name: 'getCompanyNoFormatDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getCompanyNoFormatDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getCompanyNoFormatDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getCompanyNoFormatDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getCompanyNoFormatDetailSlice.reducer;
