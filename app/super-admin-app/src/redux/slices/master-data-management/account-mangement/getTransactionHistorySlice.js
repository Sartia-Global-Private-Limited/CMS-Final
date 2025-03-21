import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting All Transaction  list  */;
export const getAllTransactionList = createAsyncThunk(
  'getAllTransactionList ',
  async ({id, date, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/master-data/accounts/get-account-transaction-history/${id}?date=${
          date || ''
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

const getTransactionHistorySlice = createSlice({
  name: 'getTransactionHistory', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllTransactionList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllTransactionList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllTransactionList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getTransactionHistorySlice.reducer;
