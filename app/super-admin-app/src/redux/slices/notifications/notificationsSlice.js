/*    ----------------Created Date :: 8 - Dec -2023   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/* api for get notification Listing*/
export const notificationList = createAsyncThunk(
  'notificationList',
  async ({search = '', pageSize = 8, pageNo = 1}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-notifications?search=${search}&&pageSize=${pageSize}&&pageNo=${pageNo}`,
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

/* api for get notification deatila by id*/
export const getNotificationDetailById = createAsyncThunk(
  'getNotificationDetailById',
  async Id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-order-by-id/${Id}`,
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

export const getNotificationCountLogged = createAsyncThunk(
  'getNotificationCountLogged',
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

const notificationSlice = createSlice({
  name: 'notification', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*  for pending state*/
    builder.addCase(notificationList.pending, (state, action) => {
      state.isLoading = true;
    });

    /*  for fulfilled state*/
    builder.addCase(notificationList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });

    /*  for rejected state*/
    builder.addCase(notificationList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default notificationSlice.reducer;
