import {createAsyncThunk} from '@reduxjs/toolkit';
import {store} from '../../store';
import axios from 'axios';
import {apiBaseUrl} from '../../../../config';

/ * api for  getting  profile detail  */;
export const getAllNotificationList = createAsyncThunk(
  'getAllNotificationList ',
  async ({search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;

    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-notifications?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
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

/ * api for  getting  unread notification count*/;
export const getUnreadNotificationCount = createAsyncThunk(
  'getUnreadNotificationCount ',
  async id => {
    const {token} = store.getState().tokenAuth;

    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/count-logged-user-unread-notifications`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
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
