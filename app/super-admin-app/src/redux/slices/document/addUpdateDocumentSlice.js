/*    ----------------Created Date :: 22- oct -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for deleting Document   by id  */;
export const deleteDocumentById = createAsyncThunk(
  'deleteDocumentById ',
  async id => {
    try {
      const {data} = await customApi.delete(
        `api/contractor/delete-document/${id}`,
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

/ * api for updating Document */;
export const updateDocument = createAsyncThunk(
  'updateDocument ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/update-document`,
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

/ * api for adding Document  */;
export const addDocument = createAsyncThunk('addDocument ', async reqBody => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/add-documents`,
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
});
