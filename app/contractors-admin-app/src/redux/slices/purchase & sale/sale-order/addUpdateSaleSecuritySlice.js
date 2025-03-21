/*    ----------------Created Date :: 5 -August -2024   ----------------- */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/*for fetching all ro number for security filter*/
export const getAllRoForSoSecurityFilter = createAsyncThunk(
  'getAllRoForSoSecurityFilter',
  async status => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/purchase-sale/sales/get-ro-for-so?status=${status || ''}&&so_id=`,
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

/*for fetching all po number for security filter*/
export const getAllSoForSoSecurityFilter = createAsyncThunk(
  'getAllSoForSoSecurityFilter',
  async ({ status, ro }) => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/purchase-sale/sales/get-so-number-for-so?status=${status || ''}&&ro=${
          ro || ''
        }`,
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
/*for fetching all security number for security  filter*/
export const getAllSecurityForSoSecurityFilter = createAsyncThunk(
  'getAllSecurityForSoSecurityFilter',
  async ({ status, so }) => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/purchase-sale/sales/get-sales-security-unique-id?status=${
          status || ''
        }&&so=${so || ''}`,
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

/ * api for approve sales order by ids  */;
export const approveSalesOrderByIds = createAsyncThunk(
  'approveSalesOrderByIds',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/purchase-sale/sales/approve-sales-order`,
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
      const { data } = await customApi.post(
        `/api/contractor/purchase-sale/sales/approve-update-sales-order`,
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
