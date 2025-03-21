import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting Payment method  list  */;

export const getAllPayMethodList = createAsyncThunk(
  'getAllPayMethodList ',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/master-data/payment-method/get-all-payment-methods?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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

const getPayMethodListSlice = createSlice({
  name: 'getPayMethodList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllPayMethodList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllPayMethodList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllPayMethodList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getPayMethodListSlice.reducer;
