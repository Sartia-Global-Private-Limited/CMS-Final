import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for deleting brand by id  */;
export const deleteBrandById = createAsyncThunk(
  'deleteBrandById ',
  async id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/item-master/delete-brand/${id}`,
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
export const updateBrand = createAsyncThunk('updateBrand ', async reqBody => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/item-master/update-brand`,
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

/ * api for adding Brand */;
export const addBrand = createAsyncThunk('addBrand ', async reqBody => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/item-master/create-brand`,
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
