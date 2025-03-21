import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for deleting Account   by id  */;
export const deleteAccountById = createAsyncThunk(
  'deleteAccountById',
  async id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/master-data/accounts/delete-account-details/${id}`,
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

/ * api for updating Account detail */;
export const updateAccountDetail = createAsyncThunk(
  'updateAccountDetail ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/master-data/accounts/update-account-details`,
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

/ * api for adding account detail  */;
export const addAccountDetail = createAsyncThunk(
  'addAccountDetail ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `api/contractor/master-data/accounts/add-bank-account-details`,
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
