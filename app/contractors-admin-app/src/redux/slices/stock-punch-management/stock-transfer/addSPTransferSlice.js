/*    ----------------Created Date :: 13-May -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for adding Stock Punch Transfer  */;
export const addStockPunchTransfer = createAsyncThunk(
  'addStockPunchTransfer ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/new-stock-transfer`,
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
