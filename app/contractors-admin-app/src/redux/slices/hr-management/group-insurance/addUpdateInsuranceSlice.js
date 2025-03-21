/*    ----------------Created Date :: 2 - Feb -2023   ----------------- */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

export const deleteInsuranceById = createAsyncThunk(
  'deleteInsuranceById',
  async id => {
    try {
      const { data } = await customApi.delete(
        `/api/contractor/payroll/group-insurance/delete-group-insurance-details/${id}`,
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

/ * api for  creating insurance */;
export const createInsurance = createAsyncThunk(
  'createInsurance ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/payroll/group-insurance/create-group-insurance`,
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

/ * api for  update insurance */;
export const updateInsurance = createAsyncThunk(
  'updateInsurance ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/payroll/group-insurance/update-group-insurance-details`,
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
