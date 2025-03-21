import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting  profile detail  */;
export const getAllNotificationList = createAsyncThunk(
  'getAllNotificationList ',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-notifications?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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

/ * api for  getting  unread notification count*/;
export const getUnreadNotificationCount = createAsyncThunk(
  'getUnreadNotificationCount ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/count-logged-user-unread-notifications`,
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
