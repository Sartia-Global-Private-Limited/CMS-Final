import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for deleting contact by id  */;
export const deleteContactById = createAsyncThunk(
  'deleteContactById ',
  async contactId => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/delete-company-contact-details/${contactId}`,
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

/ * api for updating contact  */;
export const updateContact = createAsyncThunk(
  'updateContact ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/update-stored-company-contact-details`,
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

/ * api for adding contact  */;
export const addContact = createAsyncThunk('addContact ', async reqBody => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/store-company-contact-details`,
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
