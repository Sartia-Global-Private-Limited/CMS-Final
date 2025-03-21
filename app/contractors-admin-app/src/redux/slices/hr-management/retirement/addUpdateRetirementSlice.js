import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for deleting  Retirement by Retitement id  */;
export const deleteRetirementById = createAsyncThunk(
  'deleteRetirementById ',
  async id => {
    try {
      const { data } = await customApi.delete(
        `/api/contractor/payroll/pension/delete-register-employee-pension/${id}`,
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

/ * api for creating  Retirement   */;
export const createRetirement = createAsyncThunk(
  'createRetirement ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/payroll/pension/register-employee-pension`,
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

/ * api for updating  Retirement   */;
export const updateRetirement = createAsyncThunk(
  'updateRetirement ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/payroll/pension/update-registered-pension`,
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
