import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for reject fund request by id  */;
export const rejectFRById = createAsyncThunk(
  'rejectFRById ',
  async ({ id, reqBody }) => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/reject-fund-request/${id}`,
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

/ * api for updating Fund request */;
export const updateFundRequest = createAsyncThunk(
  'updateFundRequest ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/update-fund-request-details`,
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

/ * api for adding FUnd request  */;
export const addFundRequest = createAsyncThunk(
  'addFundRequest ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/request-fund`,
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
/ * api for changing FUnd request status  */;
export const changeFundRequestStatus = createAsyncThunk(
  'changeFundRequestStatus ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/status-changed-of-request`,
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
