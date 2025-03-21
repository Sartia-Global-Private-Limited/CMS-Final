import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for add  promotion and demotion  */;
export const addPromotionDemotion = createAsyncThunk(
  'addPromotionDemotion',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/payroll/promotion-demotion/employee-promotion-demotion-add`,
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
/ * api for udpate  promotion and demotion  */;
export const updatePromotionDemotion = createAsyncThunk(
  'updatePromotionDemotion',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/payroll/promotion-demotion/update-employee-promotion-demotion-details`,
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
