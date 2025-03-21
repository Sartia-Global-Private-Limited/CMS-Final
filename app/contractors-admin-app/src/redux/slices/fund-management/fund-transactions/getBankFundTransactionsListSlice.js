/*    ----------------Created Date :: 29-March -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting Fund Transaction list based on account id  */;
export const getBankFundTransactionByAccountId = createAsyncThunk(
  'getBankFundTransactionByAccountId ',
  async ({accountId, date, search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-bank-to-all-accounts-transaction/${accountId}/fund?date=${
          date || 'last12Months'
        }&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
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

const getBankFundTransactionsListSlice = createSlice({
  name: 'getBankFundTransactionsList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending Fund request*/
    builder.addCase(
      getBankFundTransactionByAccountId.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getBankFundTransactionByAccountId.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getBankFundTransactionByAccountId.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getBankFundTransactionsListSlice.reducer;
