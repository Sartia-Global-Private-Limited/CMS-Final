/*    ----------------Created Date :: 10-April -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting supplier balance based on  id  */;
export const getSupplierBalanceById = createAsyncThunk(
  'getSupplierBalanceById ',
  async ({Id, search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-supplier-transaction/${Id}?search=${
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

const getSupplierBalanceListSlice = createSlice({
  name: 'getSupplierBalanceList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending Fund request*/
    builder.addCase(getSupplierBalanceById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSupplierBalanceById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getSupplierBalanceById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSupplierBalanceListSlice.reducer;
