/*    ----------------Created Date :: 2- Aug -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for updating promotion overview */;
export const updatePromotionOverview = createAsyncThunk(
  'updatePromotionOverview ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/update-payment-setting`,
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

/ * api for adding promotion overview */;
export const addPromotionOverview = createAsyncThunk(
  'addPromotionOverview ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/create-payment-setting`,
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
