/*    ----------------Created Date :: 5 - August -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { store } from '../../../store';
import { apiBaseUrl } from '../../../../../config';

/ * api for  getting security Detail by id  */;
export const getSaleSecurityDetailById = createAsyncThunk(
  'getSaleSecurityDetailById ',
  async ({ securityId, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/purchase-sale/sales/get-single-so-details/${securityId}?pageSize=${
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

const getSaleSecurityDetailSlice = createSlice({
  name: 'getSaleSecurityDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getSaleSecurityDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSaleSecurityDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getSaleSecurityDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSaleSecurityDetailSlice.reducer;
