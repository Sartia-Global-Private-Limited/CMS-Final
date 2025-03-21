import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting Finacial year  detail by id  */;
export const getFinancialYearDetailById = createAsyncThunk(
  'getFinancialYearDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/master-data/financial-year/fetch-financial-year-by-id/${id}`,
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

const getFinancialDetailSlice = createSlice({
  name: 'getFinancialDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getFinancialYearDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getFinancialYearDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getFinancialYearDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getFinancialDetailSlice.reducer;
