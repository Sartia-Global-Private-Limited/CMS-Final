/*    ----------------Created Date :: 19- July -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting  payment   list */;
export const getAllPaymentList = createAsyncThunk(
  'getAllPaymentList ',
  async ({search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-invoice-in-payments?search=${
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

const getPaymentUpdateListSlice = createSlice({
  name: 'getPaymentUpdateList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllPaymentList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllPaymentList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllPaymentList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getPaymentUpdateListSlice.reducer;
