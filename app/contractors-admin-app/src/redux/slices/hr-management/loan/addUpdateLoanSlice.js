/*    ----------------Created Date :: 3- Feb -2024    ----------------- */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for  update loan status */;
export const updateLoanStatus = createAsyncThunk(
  'updateLoanStatus ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/payroll/loan/changed-loan-status`,
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

/ * api for  creating loan */;
export const createLoan = createAsyncThunk('createLoan ', async reqBody => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/payroll/loan/create-loans`,
      reqBody,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/ * api for  updating loan */;
export const updateLoan = createAsyncThunk('createLoan ', async reqBody => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/payroll/loan/update-loan-details`,
      reqBody,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});
