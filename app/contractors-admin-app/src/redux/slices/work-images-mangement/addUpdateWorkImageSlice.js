/*    ----------------Created Date :: 20- Feb -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for deleting Work Image  by id  */;
export const deleteWorkImageById = createAsyncThunk(
  'deleteWorkImageById ',
  async workId => {
    try {
      const {data} = await customApi.delete(
        `api/contractor/delete-uploaded-complaint-images/${workId}`,
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

/ * api for updating Work Image */;
export const updateWorkImage = createAsyncThunk(
  'updateWorkImage ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/update-uploaded-complaint-images`,
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

/ * api for approve and reject Work Image by id and status*/;
export const approveAndRejectWorkImage = createAsyncThunk(
  'approveAndRejectWorkImage ',
  async ({id, status}) => {
    try {
      const {data} = await customApi.put(
        `/api/contractor/approve-reject-complaint-images-by-status?status=${
          status || ''
        }&id=${id || ''}`,
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

/ * api for adding Work Image */;
export const addWorkImage = createAsyncThunk('addWorkImage ', async reqBody => {
  try {
    const {data} = await customApi.post(
      `/api/contractor/upload-complaint-images`,
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
