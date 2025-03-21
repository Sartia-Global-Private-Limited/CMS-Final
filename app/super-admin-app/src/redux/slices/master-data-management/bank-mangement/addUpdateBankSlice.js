import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for deleting Document   by id  */;
export const deleteDocumentById = createAsyncThunk(
  'deleteDocumentById ',
  async id => {
    try {
      const {data} = await customApi.delete(
        `api/contractor/master-data/bank/delete-document/${id}`,
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

/ * api for updating Bank detail */;
export const updateBankDetail = createAsyncThunk(
  'updateBankDetail ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/master-data/bank/update-bank-details`,
        reqBody,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
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

/ * api for adding Bank detail  */;
export const addBankDetail = createAsyncThunk(
  'addBankDetail ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/master-data/bank/add-bank-details`,
        reqBody,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
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
