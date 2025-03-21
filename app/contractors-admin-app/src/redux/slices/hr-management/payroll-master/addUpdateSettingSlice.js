/*    ----------------Created Date :: 1- Feb -2024    ----------------- */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for updating  status of settings by setting  id  */;
export const updateSettingStatus = createAsyncThunk(
  'updateSettingStatus ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/payroll/payroll-master/update-payroll-master-settings`,
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

/ * api for creating new setting */;
export const createSetting = createAsyncThunk(
  'createSetting ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/payroll/payroll-master/create-new-payroll-settings`,
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

/ * api for updating setting */;
export const updateSetting = createAsyncThunk(
  'updateSetting ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `api/contractor/update-payroll-master-settings-label`,
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
