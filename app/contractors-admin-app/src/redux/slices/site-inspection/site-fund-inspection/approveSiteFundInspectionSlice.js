/*    ----------------Created Date :: 20 - May -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for approving site fund inspection  */;
export const approveSiteFundInspection = createAsyncThunk(
  'approveSiteFundInspection ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/approve-site-inspection-for-fund`,
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
