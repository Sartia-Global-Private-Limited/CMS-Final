import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

/ * api for deleting Supplier   by id  */;
export const deleteSupplierById = createAsyncThunk(
  'deleteSupplierById ',
  async id => {
    try {
      const { data } = await customApi.delete(
        `/api/contractor/suppliers/delete-suppliers/${id}`,
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

/ * api for approve and reject suppliers by id and status*/;
export const approveAndRejectSuppliers = createAsyncThunk(
  'approveAndRejectSuppliers',
  async ({ id, status }) => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/suppliers/approve-reject-suppliers-by-id?status=${
          status || ''
        }&&id=${id || ''}`,
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

/ * api for updating suppliers */;
export const updateSuppliers = createAsyncThunk(
  'updateSuppliers ',
  async ({ id, reqBody }) => {
    try {
      const { data } = await customApi.put(
        `/api/contractor/suppliers/update-suppliers/${id}`,
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

/ * api for adding Supliers */;
export const addSupplier = createAsyncThunk('addSupplier ', async reqBody => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/suppliers/create-suppliers`,
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
