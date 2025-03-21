/*    ----------------Created Date :: 5- August -2024   ----------------- */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for deleting  sales order by so id  */;
export const deleteSOById = createAsyncThunk('deleteSOById ', async soId => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/purchase-sale/sales/delete-so-details/${soId}`,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/ * api for update sales order status by so id  */;
export const updateSOStatus = createAsyncThunk(
  'updateSOStatus ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/purchase-sale/sales/change-so-status`,
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

/ * api for add sales order */;
export const addSalesOrder = createAsyncThunk(
  'addSalesOrder ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/purchase-sale/sales/create-so-order`,
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
/ * api for update sales order */;
export const updateSalesOrder = createAsyncThunk(
  'updateSalesOrder ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/purchase-sale/sales/update-so-details`,
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
