import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting all sales order  Detail by po id  */;
export const getSalesOrderDetailById = createAsyncThunk(
  'getSalesOrderDetailById ',
  async ({soId, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/purchase-sale/sales/get-single-so-details/${
          soId || ''
        }?pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}search=`,
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

const getSaleOrderDetailSlice = createSlice({
  name: 'getSaleOrderDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getSalesOrderDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSalesOrderDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getSalesOrderDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSaleOrderDetailSlice.reducer;
