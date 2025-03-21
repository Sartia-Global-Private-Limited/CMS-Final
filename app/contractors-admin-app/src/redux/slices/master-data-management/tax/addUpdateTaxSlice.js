import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for deleting Tax   by id  */;
export const deleteTaxById = createAsyncThunk('deleteTaxById ', async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/master-data/tax/delete-tax-details/${id}`,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/ * api for updating Financial year */;
export const updateTax = createAsyncThunk('updateTax ', async reqBody => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/master-data/tax/update-tax-details`,
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

/ * api for adding Tax  */;
export const addTax = createAsyncThunk('addTax ', async reqBody => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/master-data/tax/create-tax`,
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
