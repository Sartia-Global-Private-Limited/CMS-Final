import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for deleting Bill FOrmat  by id  */;
export const deleteBillFomartById = createAsyncThunk(
  'deleteBillFomartById ',
  async id => {
    try {
      const { data } = await customApi.delete(
        `/api/contractor/master-data/bill-format/delete-invoice-number-format-details/${id}`,
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

/ * api for updating Bill format */;
export const updateBillFormat = createAsyncThunk(
  'updateBillFormat ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/master-data/bill-format/update-invoice-number-format`,
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

/ * api for adding Bill Format  */;
export const addBillFormat = createAsyncThunk(
  'addBillFormat ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/master-data/bill-format/generate-invoice-number-format`,
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
