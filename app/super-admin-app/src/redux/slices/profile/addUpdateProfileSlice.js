import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for deleting Document   by id  */;
export const deleteDocumentById = createAsyncThunk(
  'deleteDocumentById ',
  async id => {
    try {
      const {data} = await customApi.delete(
        `api/super-admin/delete-document/${id}`,
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

/ * api for updating Profile */;
export const updateProfile = createAsyncThunk(
  'updateProfile ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/profile-update`,
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

/ * api for updating password  */;
export const updatePassword = createAsyncThunk(
  'updatePassword ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/change-password`,
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
