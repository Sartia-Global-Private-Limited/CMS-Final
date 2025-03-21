/*    ----------------Created Date :: 22-April -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting expemse Transaction list based on end user id  */;
export const getBankFundTransactionByUserId = createAsyncThunk(
  'getBankFundTransactionByUserId ',
  async ({empId, date, search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-expense-transaction/${empId}?date=${
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

const getExpenseTransactionSlice = createSlice({
  name: 'getExpenseTransaction', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending Fund request*/
    builder.addCase(getBankFundTransactionByUserId.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      getBankFundTransactionByUserId.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getBankFundTransactionByUserId.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getExpenseTransactionSlice.reducer;
