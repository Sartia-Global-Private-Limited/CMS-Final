import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for deleting ItemNo FOrmat  by id  */;
export const deleteItemNoFomartById = createAsyncThunk(
  'deleteItemNoFomartById ',
  async id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/master-data/item-format/delete-item-number-format/${id}`,
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

/ * api for updating ItemNo format */;
export const updateItemNoFormat = createAsyncThunk(
  'updateItemNoFormat ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/master-data/item-format/update-item-number-format`,
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

/ * api for adding ItemNo Format  */;
export const addItemNoFormat = createAsyncThunk(
  'addItemNoFormat ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/master-data/item-format/generate-item-number-format`,
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
