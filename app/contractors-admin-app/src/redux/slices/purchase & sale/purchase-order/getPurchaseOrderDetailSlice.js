/*    ----------------Created Date :: 14- June -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { store } from '../../../store';
import { apiBaseUrl } from '../../../../../config';

/ * api for  getting all purchase order  Detail by po id  */;
export const getPurchaseOrderDetailById = createAsyncThunk(
  'getPurchaseOrderDetailById ',
  async ({ poId, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/purchase-sale/purchase/get-single-po-details/${poId}?pageSize=${
          pageSize || ''
        }&&pageNo=${pageNo || ''}`,
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

const getPurchaseOrderDetailSlice = createSlice({
  name: 'getPurchaseOrderDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getPurchaseOrderDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPurchaseOrderDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPurchaseOrderDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getPurchaseOrderDetailSlice.reducer;
