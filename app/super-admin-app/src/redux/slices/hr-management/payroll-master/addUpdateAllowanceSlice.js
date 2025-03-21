import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  creating allowance */;
export const createAllowance = createAsyncThunk(
  'createAllowance ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/payroll/payroll-master/create-allowances`,
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
