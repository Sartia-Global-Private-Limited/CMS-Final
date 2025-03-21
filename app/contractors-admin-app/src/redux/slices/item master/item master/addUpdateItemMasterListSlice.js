/*    ----------------Created Date :: 5 - August -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for deleting item master by id  */;
export const deleteItemMasterItemById = createAsyncThunk(
  'deleteItemMasterItemById ',
  async assestId => {
    try {
      const {data} = await customApi.delete(
        `/api/contractor/delete-item-master/${assestId}`,
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

/ * api for updating item master item  */;
export const updateItemMasterItem = createAsyncThunk(
  'updateItemMasterItem ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/update-item-master-details`,
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

/ * api for adding item master item */;
export const addItemMasterItem = createAsyncThunk(
  'addItemMasterItem ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/create-item-master`,
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
