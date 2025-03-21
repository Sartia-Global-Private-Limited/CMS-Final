import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for deleting Bulkmessage by id  */;
export const deleteBulkMessageById = createAsyncThunk(
  'deleteBulkMessageById ',
  async contactId => {
    try {
      const { data } = await customApi.delete(
        `/api/contractor/delete-message/${contactId}`,
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

/ * api for updating message  */;
export const updateMessage = createAsyncThunk(
  'updateMessage ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/update-message`,
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

/ * api for creating message  */;
export const createBulkMessage = createAsyncThunk(
  'createBulkMessage ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/send-message`,
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
