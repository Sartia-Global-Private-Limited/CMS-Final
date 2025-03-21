import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for deleting Unit data   by id  */;
export const deleteUnitDataById = createAsyncThunk(
  'deleteUnitDataById ',
  async id => {
    try {
      const { data } = await customApi.delete(
        `/api/contractor/product-management/unit/delete-unit-data-by-id/${id}`,
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

/ * api for updating UnitData */;
export const updateUnitData = createAsyncThunk(
  'updateUnitData ',
  async ({ id, reqBody }) => {
    try {
      const { data } = await customApi.put(
        `api/contractor/update-unit-data-by-id/${id}`,
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

/ * api for adding Unit data */;
export const addUnitData = createAsyncThunk('addUnitData ', async reqBody => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/product-management/unit/create-unit-data`,
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
