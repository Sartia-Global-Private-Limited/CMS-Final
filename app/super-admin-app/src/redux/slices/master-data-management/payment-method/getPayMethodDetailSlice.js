import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting Pay Method detail by id  */;
export const getPayMethodDetailById = createAsyncThunk(
  'getPayMethodDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/master-data/payment-method/get-single-payment-method-details/${id}`,
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

const getPayMethodDetailSlice = createSlice({
  name: 'getPayMethodDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getPayMethodDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPayMethodDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPayMethodDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getPayMethodDetailSlice.reducer;
