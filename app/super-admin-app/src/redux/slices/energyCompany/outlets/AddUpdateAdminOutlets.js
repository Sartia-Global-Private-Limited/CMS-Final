import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for deleting Outlet by id  */;
export const deleteOutletById = createAsyncThunk(
  'deleteOutletById',
  async id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/fuel-station/delete-outlet/${id}`,
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

/ * api for approve and reject Outlet by id and status*/;
export const approveAndRejectOutlet = createAsyncThunk(
  'approveAndRejectOutlet',
  async ({id, status}) => {
    try {
      const {data} = await customApi.put(
        `/api/super-admin/fuel-station/approve-reject-outlet-by-id?id=${
          id || ''
        }&&status=${status || ''}`,
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

/ * api for updating outlet  */;
export const updateOutlet = createAsyncThunk('updateOutlet ', async reqBody => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/outlets/update-outlet`,
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

/ * api for adding outlet  */;
export const addOutlet = createAsyncThunk('addOutlet ', async reqBody => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/outlets/add-outlet`,
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
