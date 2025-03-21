/*    ----------------Created Date :: 8 -June -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

export const addMeasurementDoc = createAsyncThunk(
  'addMeasurementDoc',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/files-upload-in-billing`,
        reqBody,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error.response.data.message || error.message,
      };
    }
  },
);

export const updateMeasurementDoc = createAsyncThunk(
  'updateMeasurementDoc',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/update-pi-attachment-complaint`,
        reqBody,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error.response.data.message || error.message,
      };
    }
  },
);
