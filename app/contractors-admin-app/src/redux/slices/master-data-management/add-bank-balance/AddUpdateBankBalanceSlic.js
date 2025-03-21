import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for adding account balance  */;
export const addAccountBalance = createAsyncThunk(
  'addAccountBalance ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/master-data/add-balance/add-wallet-amount`,
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
