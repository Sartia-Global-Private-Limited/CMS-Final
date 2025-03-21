import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for deleting Gst Tax   by id  */;
export const deleteGstTaxById = createAsyncThunk(
  'deleteGstTaxById ',
  async id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/master-data/tax/delete-gst-details/${id}`,
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

/ * api for updating Gst tax */;
export const updateGstTax = createAsyncThunk('updateGstTax ', async reqBody => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/master-data/tax/update-gst-details`,
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

/ * api for adding Gst Tax  */;
export const addGstTax = createAsyncThunk('addGstTax ', async reqBody => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/master-data/tax/save-gst-details`,
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
