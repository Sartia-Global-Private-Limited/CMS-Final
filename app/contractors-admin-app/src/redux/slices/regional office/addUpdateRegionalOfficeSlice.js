/*    ----------------Created Date :: 10 - August -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for creating payment paid */;
export const addPaymentRegionalOffice = createAsyncThunk(
  'addPaymentRegionalOffice ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/add-ro-payment-paid`,
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
/ * api for updating payment of regional office */;
export const updatePaymentRegionalOffice = createAsyncThunk(
  'updatePaymentRegionalOffice ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/update-ro-payment-paid`,
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
