/*    ----------------Created Date :: 30- Sep -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for deleting brand by id  */;
export const deleteSubCategoryById = createAsyncThunk(
  'deleteSubCategoryById',
  async id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/item-master/delete-sub-category/${id}`,
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

/ * api for updating sub Category */;
export const updateSubCategory = createAsyncThunk(
  'updateSubCategory ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/item-master/edit-sub-category`,
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

/ * api for add SubCategory */;
export const addSubCategory = createAsyncThunk(
  'addSubCategory ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/item-master/add-sub-category`,
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
