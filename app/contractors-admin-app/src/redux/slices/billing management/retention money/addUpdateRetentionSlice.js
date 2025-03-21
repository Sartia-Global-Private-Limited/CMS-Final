/*    ----------------Created Date :: 22 -July -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/*for fetching all Po number for rentention filter*/
export const getAllPoForRetentionFilter = createAsyncThunk(
  'getAllPoForRetentionFilter',
  async status => {
    try {
      const {data} = await customApi.get(
        `/api/contractor/get-po-for-payment-retention?status=${
          status || ''
        }&&billing_ro=`,
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

/*for fetching all Ro number for rentention filter*/
export const getAllRoForRetentionFilter = createAsyncThunk(
  'getAllRoForRetentionFilter',
  async ({status, po}) => {
    try {
      const {data} = await customApi.get(
        `/api/contractor/get-ro-for-dropdown?status=${status || ''}&&po=${
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
/*for fetching all retention number for rentention filter*/
export const getAllRetentionForRetentionFilter = createAsyncThunk(
  'getAllRetentionForRetentionFilter',
  async ({status, ro}) => {
    try {
      const {data} = await customApi.get(
        `/api/contractor/get-retention-id-for-dropdown?status=${
          status || ''
        }&&ro=${ro || ''}`,
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

/ * api for rejecting retention money by id  */;
export const rejectRetentionById = createAsyncThunk(
  'rejectRetentionById',
  async id => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/discard-payment-retention/${id || ''}`,
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
/ * api for approve payment retention money by ids  */;
export const approvePayementRetentionByIds = createAsyncThunk(
  'approvePayementRetentionByIds',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/approve-payment-retention`,
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
/ * api for update payment retention   */;
export const updatePayementRetentionById = createAsyncThunk(
  'updatePayementRetentionById',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/update-payment-retention`,
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
/ * api for update payment amount of  retention   */;
export const updatePayementAmountRetention = createAsyncThunk(
  'updatePayementAmountRetention',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/update-payment-amount-retention`,
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
