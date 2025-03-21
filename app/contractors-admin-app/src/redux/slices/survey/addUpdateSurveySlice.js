/*    ----------------Created Date :: 21-sep -2024   ----------------- */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

/ * api for updating Earhting testing */;
export const updateEarthingTesting = createAsyncThunk(
  'updateEarthingTesting ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/update-earthing-testing-detail`,
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

/ * api for updating Survey Status */;
export const updateSurveyStatus = createAsyncThunk(
  'updateSurveyStatus ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/changed-survey-status`,
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

/ * api for adding Earthing tessting  */;
export const addEarthingTesting = createAsyncThunk(
  'addEarthingTesting ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/earthing-testing/add-earthing-testing-report`,
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

export const assignSurveyToEnergyCompany = createAsyncThunk(
  'assignSurveyToEnergyCompany',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/assign-survey`,
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
