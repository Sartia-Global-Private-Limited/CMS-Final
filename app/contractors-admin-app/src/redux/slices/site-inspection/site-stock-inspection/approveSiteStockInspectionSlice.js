/*    ----------------Created Date :: 18 - May -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for approving site stock inspection  */;
export const approveSiteStockInspection = createAsyncThunk(
  'approveSiteStockInspection ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/approved-site-inspections`,
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
