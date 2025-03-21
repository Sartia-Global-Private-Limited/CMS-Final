/*    ----------------Created Date :: 10- Aug -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../config';
import {store} from '../../store';

/ * api for  getting All ro transaction list  */;
export const getAllRoTransactionList = createAsyncThunk(
  'getAllRoTransactionList ',
  async ({search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-transactions-balance-of-ro?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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

const getRoTransactionListSlice = createSlice({
  name: 'getRoTransactionList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllRoTransactionList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllRoTransactionList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllRoTransactionList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getRoTransactionListSlice.reducer;
