/*    ----------------Created Date :: 16 - May -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for adding Stock request  */;
export const approveOfficeStockInspection = createAsyncThunk(
  'approveOfficeStockInspection ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/stock-punch-approve-by-office`,
        reqBody,
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
