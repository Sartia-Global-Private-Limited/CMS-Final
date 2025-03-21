/*    ----------------Created Date :: 8 - April -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';
import moment from 'moment';

/ * api for adding Stock Transfer  */;
export const addStockTransfer = createAsyncThunk(
  'addStockTransfer ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/stock-transfer`,
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
/ * api for updating Stock Transfer Bill no and date  */;
export const updateStockTransferBillAndDate = createAsyncThunk(
  'updateStockTransferBillAndDate ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/update-transfer-bill-and-date`,
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

/*api for rejecting the Stock Transfer*/
export const rejectStockTransfer = createAsyncThunk(
  'rejectStockTransfer',
  async ({reqBody}) => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/rejected-stock-request`,
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

/* api for Rescheduling Stock Transfer  */
export const rescheduleStockTransfer = createAsyncThunk(
  'rescheduleStockTransfer',
  async ({id, date}) => {
    const formatedDate = moment(date).format('YYYY-MM-DD');

    try {
      const {data} = await customApi.post(
        `/api/contractor/rescheduled-stocks-transfer-stock/${id}/${formatedDate}`,
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
