import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  update Resignation status */;
export const updateResignationStatus = createAsyncThunk(
  'updateResignationStatus ',
  async ({resignationId, statusId}) => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/payroll/resignation/update-resignations-request-by-admin/${resignationId}/${statusId}`,
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
/ * api for  creating Resignation  */;
export const createResignation = createAsyncThunk(
  'createResignation ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/sub-user/payroll/resignation/register-employee-resignation`,
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

/ * api for  updating Resignation */;
export const updateResignation = createAsyncThunk(
  'updateResignation ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/payroll/resignation/update-resignations-details`,
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
