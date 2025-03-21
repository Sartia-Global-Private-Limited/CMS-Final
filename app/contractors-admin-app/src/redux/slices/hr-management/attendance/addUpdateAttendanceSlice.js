import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for upate attendacnce status by emp id  */;
export const updateAttendanceStatus = createAsyncThunk(
  'updateAttendanceStatus ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/hr-attendance/change-user-attendance-status-by-super-admin`,
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

/ * api for adding attendacnce   */;
export const addAttendance = createAsyncThunk(
  'addAttendance ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/hr-attendance/mark-manually-attendance-for-user`,
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
/ * api for marked attendance  mannualy   */;
export const markAttendance = createAsyncThunk(
  'markAttendance ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/hr-attendance/mark-manual-attendance`,
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

/ * api for marked attendance  mannualy in bulk  */;
export const markAttendanceInBulk = createAsyncThunk(
  'markAttendanceInBulk ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/hr-attendance/mark-attendance-in-bulk`,
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
