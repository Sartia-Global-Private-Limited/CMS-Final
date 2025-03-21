import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for deleting Product by id  */;
export const deleteProductById = createAsyncThunk(
  'deleteProductById ',
  async id => {
    try {
      const { data } = await customApi.delete(
        `/api/contractor/product-management/product/delete-product/${id}`,
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

/ * api for updating Product */;
export const updateProduct = createAsyncThunk(
  'updateProduct ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/product-management/product/product-detail-update`,
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

/ * api for adding Product  */;
export const addProduct = createAsyncThunk('addProduct ', async reqBody => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/product-management/product/product-add`,
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

/ * api for upate product status by product id  */;
export const updateProductStatus = createAsyncThunk(
  'updateProductStatus ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/product-management/product/product-publish-status-update`,
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
