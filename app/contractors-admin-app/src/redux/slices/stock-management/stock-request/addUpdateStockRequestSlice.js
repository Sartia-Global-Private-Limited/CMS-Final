/*    ----------------Created Date :: 4 - April -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for reject stock request by id  */;
export const rejectStockRequestById = createAsyncThunk(
  'rejectStockRequestById ',
  async ({reqBody}) => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/rejected-stock-request`,
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

/ * api for updating Stock request */;
export const updateStockRequest = createAsyncThunk(
  'updateStockRequest ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/update-stock-request`,
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

/ * api for adding Stock request  */;
export const addStockRequest = createAsyncThunk(
  'addStockRequest ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/save-stock-request`,
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
/ * api for changing Stock request status  */;
export const changeStockRequestStatus = createAsyncThunk(
  'changeStockRequestStatus ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/change-stock-request`,
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
