import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for deleting Pay Method by id  */;
export const deletePayMethodById = createAsyncThunk(
  'deletePayMethodById ',
  async id => {
    try {
      const { data } = await customApi.delete(
        `/api/contractor/master-data/payment-method/delete-payment-methods/${id}`,
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

/ * api for updating Pay Method */;
export const updatePayMethod = createAsyncThunk(
  'updatePayMethod ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/master-data/payment-method/update-payment-method`,
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

/ * api for adding Pay Method */;
export const addPayMethod = createAsyncThunk('addPayMethod ', async reqBody => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/master-data/payment-method/add-payment-method`,
      reqBody,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});
