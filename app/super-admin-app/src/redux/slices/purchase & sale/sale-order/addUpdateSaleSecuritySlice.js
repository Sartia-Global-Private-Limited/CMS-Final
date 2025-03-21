import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/*for fetching all ro number for security filter*/
export const getAllRoForSoSecurityFilter = createAsyncThunk(
  'getAllRoForSoSecurityFilter',
  async status => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-ro-for-so?status=${status || ''}&&so_id=`,
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

/*for fetching all po number for security filter*/
export const getAllSoForSoSecurityFilter = createAsyncThunk(
  'getAllSoForSoSecurityFilter',
  async ({status, ro}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-so-number-for-so?status=${status || ''}&&ro=${
          ro || ''
        }`,
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
/*for fetching all security number for security  filter*/
export const getAllSecurityForSoSecurityFilter = createAsyncThunk(
  'getAllSecurityForSoSecurityFilter',
  async ({status, so}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-sales-security-unique-id?status=${
          status || ''
        }&&so=${so || ''}`,
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

/ * api for approve sales order by ids  */;
export const approveSalesOrderByIds = createAsyncThunk(
  'approveSalesOrderByIds',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/approve-sales-order`,
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

/ * api for update securtiy sales order   */;
export const updateSecuritySalesOrder = createAsyncThunk(
  'updateSecuritySalesOrder',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/approve-update-sales-order`,
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
