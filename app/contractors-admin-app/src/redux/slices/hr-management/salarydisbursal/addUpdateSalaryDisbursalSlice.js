import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for Mark Salary Disbursal   */;

export const markSalaryDisbursal = createAsyncThunk(
  'markSalaryDisbursal',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/payroll/salary-disbursal/mark-salary-disbursed`,
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
