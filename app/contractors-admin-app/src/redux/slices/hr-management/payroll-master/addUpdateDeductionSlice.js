/*    ----------------Created Date :: 2- Feb -2024    ----------------- */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for  creating deduction */;
export const createDeduction = createAsyncThunk(
  'createDeduction ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/payroll/payroll-master/create-deductions`,
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
