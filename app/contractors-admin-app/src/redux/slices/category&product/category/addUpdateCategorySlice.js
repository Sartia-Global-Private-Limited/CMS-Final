/*    ----------------Created Date :: 28- Feb -2024   ----------------- */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for deleting Category   by id  */;
export const deleteCategoryById = createAsyncThunk(
  'deleteCategoryById ',
  async id => {
    try {
      const { data } = await customApi.delete(
        `/api/contractor/product-management/category/delete-category-detail/${id}`,
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

/ * api for updating Category */;
export const updateCategory = createAsyncThunk(
  'updateCategory ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/product-management/category/update-category-detail`,
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

/ * api for adding Category */;
export const addCategory = createAsyncThunk('addCategory ', async reqBody => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/product-management/category/create-category`,
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
