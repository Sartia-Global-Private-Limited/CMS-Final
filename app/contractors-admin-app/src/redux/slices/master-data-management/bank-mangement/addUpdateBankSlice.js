/*    ----------------Created Date :: 6-March -2024   ----------------- */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for updating Bank detail */;
export const updateBankDetail = createAsyncThunk(
  'updateBankDetail ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/master-data/bank/update-bank-details`,
        reqBody,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
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

/ * api for adding Bank detail  */;
export const addBankDetail = createAsyncThunk(
  'addBankDetail ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/master-data/bank/add-bank-details`,
        reqBody,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
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
