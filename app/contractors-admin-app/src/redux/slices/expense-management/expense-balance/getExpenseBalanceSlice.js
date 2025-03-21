/*    ----------------Created Date :: 22-April -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting Expense Balance based on emp id  */;
export const getExpenseBalanceByEmpId = createAsyncThunk(
  'getExpenseBalanceByEmpId ',
  async ({empId, search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-last-balance-of-employee/${
          empId || ''
        }?search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
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

const getExpenseBalanceSlice = createSlice({
  name: 'getExpenseBalance', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getExpenseBalanceByEmpId.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getExpenseBalanceByEmpId.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getExpenseBalanceByEmpId.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getExpenseBalanceSlice.reducer;
