/*    ----------------Created Date :: 18-April -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for adding Expense Punch  */;
export const addExpensePunch = createAsyncThunk(
  'addExpensePunch ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/add-expense-punch`,
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
/ * api for apporve Expense Punch  */;
export const approveExpensePunch = createAsyncThunk(
  'approveExpensePunch ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/update-approve-qty`,
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
