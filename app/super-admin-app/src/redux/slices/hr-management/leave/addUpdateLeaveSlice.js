import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for upate Leave status by emp id  */;
export const updateLeaveStatus = createAsyncThunk(
  'updateLeaveStatus ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `api/super-admin/hr-leaves/leave-application-status-update`,
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

/ * api for creating leave */;
export const createLeave = createAsyncThunk('createLeave ', async reqBody => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/hr-leaves/apply-leave`,
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
