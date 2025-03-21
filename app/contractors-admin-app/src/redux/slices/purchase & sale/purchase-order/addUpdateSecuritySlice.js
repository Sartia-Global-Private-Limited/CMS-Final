/*    ----------------Created Date :: 30 -July -2024   ----------------- */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/*for fetching all ro number for security filter*/
export const getAllRoForSecurityFilter = createAsyncThunk(
  'getAllRoForSecurityFilter',
  async status => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/purchase-sale/get-ro-for-po?status=${status || ''}&&po_id=`,
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
export const getAllPoForSecurityFilter = createAsyncThunk(
  'getAllPoForSecurityFilter',
  async ({ status, ro }) => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/purchase-sale/get-po-number-for-po?status=${status || ''}&&ro=${
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
export const getAllSecurityForSecurityFilter = createAsyncThunk(
  'getAllSecurityForSecurityFilter',
  async ({ status, po }) => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/get-security-unique-id?status=${status || ''}&&po=${
          po || ''
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

/ * api for approve purchase order by ids  */;
export const approvePurchaseOrderByIds = createAsyncThunk(
  'approvePurchaseOrderByIds',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/approve-purchase-order`,
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

/ * api for update securtiy purchase order   */;
export const updateSecurityPurchaseOrder = createAsyncThunk(
  'updateSecurityPurchaseOrder',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/approve-update-purchase-order`,
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
