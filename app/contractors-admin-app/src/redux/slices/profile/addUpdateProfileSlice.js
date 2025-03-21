/*    ----------------Created Date :: 5 -  March -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for updating Profile */;
export const updateProfile = createAsyncThunk(
  'updateProfile ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/profile-update`,
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

/ * api for updating password  */;
export const updatePassword = createAsyncThunk(
  'updatePassword ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/change-password`,
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
