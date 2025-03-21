import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for deleting Finance year   by id  */;
export const deleteFinancialYearById = createAsyncThunk(
  'deleteFinancialYearById ',
  async id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/master-data/financial-year/delete-financial-year-by-id/${id}`,
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

/ * api for updating Financial year */;
export const updateFiannceYear = createAsyncThunk(
  'updateFiannceYear ',
  async ({reqBody, id}) => {
    try {
      const {data} = await customApi.put(
        `/api/super-admin/master-data/financial-year/update-financial-year-by-id/${id}`,
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

/ * api for adding Finance year  */;
export const addFiannceYear = createAsyncThunk(
  'addFiannceYear ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/master-data/financial-year/create-financial-year`,
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
