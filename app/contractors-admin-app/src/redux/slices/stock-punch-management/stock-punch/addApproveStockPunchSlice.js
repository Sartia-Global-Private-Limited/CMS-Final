/*    ----------------Created Date :: 23-April -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for adding Stock Punch  */;
export const addStockPunch = createAsyncThunk(
  'addStockPunch ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/stock-punch`,
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
/ * api for apporve Stock Punch  */;
export const approveStockPunch = createAsyncThunk(
  'approveStockPunch ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/approve-stock-punch-quantity`,
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
