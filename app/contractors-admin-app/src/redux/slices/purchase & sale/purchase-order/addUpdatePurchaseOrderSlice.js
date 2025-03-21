/*    ----------------Created Date :: 14- June -2024   ----------------- */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for deleting  purchase order by po id  */;
export const deletePOById = createAsyncThunk('deletePOById ', async poId => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/purchase-sale/purchase/delete-po-details/${poId}`,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/ * api for update purchase order status by po id  */;
export const updatePOStatus = createAsyncThunk(
  'updatePOStatus ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/purchase-sale/purchase/change-po-status`,
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

/ * api for add purchase order */;
export const addPurchaseOrder = createAsyncThunk(
  'addPurchaseOrder ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/purchase-sale/purchase/create-po-order`,
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
/ * api for update purchase order */;
export const updatePurchaseOrder = createAsyncThunk(
  'updatePurchaseOrder ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/purchase-sale/purchase/update-po-details`,
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
