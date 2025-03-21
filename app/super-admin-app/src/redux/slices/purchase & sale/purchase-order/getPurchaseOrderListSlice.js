import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting all purchase order  list  */;

export const getPurchaseOrderList = createAsyncThunk(
  'getPurchaseOrderList ',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/purchase-sale/purchase/get-all-generated-po?search=${
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

const getPurchaseOrderListSlice = createSlice({
  name: 'getPurchaseOrderList', // to be use in ui for fetching data from store by useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getPurchaseOrderList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPurchaseOrderList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPurchaseOrderList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getPurchaseOrderListSlice.reducer;
