/*    ----------------Created Date :: 2- Aug -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for updating area manager overview ration*/;
export const updateAreaManagerRatioOverview = createAsyncThunk(
  'updateAreaManagerRatioOverview ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/update-promotional-manager`,
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

/ * api for adding area manager ratio overview */;
export const addAreaManagerRatioOverview = createAsyncThunk(
  'addAreaManagerRatioOverview ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/add-promotional-manager`,
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
