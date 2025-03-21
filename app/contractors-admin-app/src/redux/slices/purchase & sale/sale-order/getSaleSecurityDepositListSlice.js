/*    ----------------Created Date :: 5- August -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { store } from '../../../store';
import { apiBaseUrl } from '../../../../../config';

/ * api for  getting all security   list  */;
export const getAllSalesSecurityList = createAsyncThunk(
  'getAllSalesSecurityList ',
  async ({
    search,
    pageSize,
    pageNo,
    status,
    soStatus,
    roId,
    soId,
    securityId,
  }) => {
    const { token } = store.getState().tokenAuth;

    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/purchase-sale/sales/get-all-generated-so?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&status=${
          status || ''
        }&&so_status=${soStatus || ''}&&ro_office=${roId || ''}&&so_number=${
          soId || ''
        }&&security_id=${securityId || ''}`,
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

const getSaleSecurityDepositListSlice = createSlice({
  name: 'getSaleSecurityDepositList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllSalesSecurityList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllSalesSecurityList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllSalesSecurityList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSaleSecurityDepositListSlice.reducer;
