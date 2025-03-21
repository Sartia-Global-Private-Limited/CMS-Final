/*    ----------------Created Date :: 17 - May -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for approving office fund inspection  */;
export const approveOfficeFundInspection = createAsyncThunk(
  'approveOfficeFundInspection ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/fund-punch-approve-by-office`,
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
