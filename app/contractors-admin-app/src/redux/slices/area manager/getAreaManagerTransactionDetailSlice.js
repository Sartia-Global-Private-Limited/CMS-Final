/*    ----------------Created Date :: 3- Aug -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../config';
import {store} from '../../store';

/ * api for  getting All area manager transaction  */;
export const getAllAreaMangerTransaction = createAsyncThunk(
  'getAllAreaMangerTransaction ',
  async ({id, search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-area-manager-transactions?id=${
          id || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
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

const getAreaManagerTransactionDetailSlice = createSlice({
  name: 'getAreaManagerTransactionDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllAreaMangerTransaction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllAreaMangerTransaction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllAreaMangerTransaction.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAreaManagerTransactionDetailSlice.reducer;
