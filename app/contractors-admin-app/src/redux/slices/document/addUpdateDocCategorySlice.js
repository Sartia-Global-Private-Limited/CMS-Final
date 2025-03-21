import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

/ * api for deleting Document category   by id  */;
export const deleteDocCategoryById = createAsyncThunk(
  'deleteDocCategoryById ',
  async id => {
    try {
      const { data } = await customApi.delete(
        `api/contractor/delete-document-category/${id}`,
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

/ * api for updating Work Image */;
export const updateDocCategory = createAsyncThunk(
  'updateDocCategory ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/update-document-category-details`,
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

/ * api for adding Document Category */;
export const addDocCategory = createAsyncThunk(
  'addDocCategory ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/create-document-category`,
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
