/*    ----------------Created Date :: 27-March -2024   ----------------- */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';
import moment from 'moment';

/ * api for adding FUnd Transfer  */;
export const addFundTransfer = createAsyncThunk(
  'addFundTransfer ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/transfer-fund`,
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

/*api for rejecting the fund Transfer*/
export const rejectFundTransfer = createAsyncThunk(
  'rejectFundTransfer',
  async ({ id, reqBody }) => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/reject-fund-request/${id}`,
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

/* api for Rescheduling Fund Transfer  */
export const rescheduleFundTransfer = createAsyncThunk(
  'rescheduleFundTransfer',
  async ({ id, date }) => {
    const formatedDate = moment(date).format('YYYY-MM-DD');
    try {
      const { data } = await customApi.post(
        `/api/contractor/fund/fund-transfer/rescheduled-transfer-fund/${id}/${formatedDate}`,
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
