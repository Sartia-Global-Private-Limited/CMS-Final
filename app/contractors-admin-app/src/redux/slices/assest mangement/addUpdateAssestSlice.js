import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

/ * api for deleting assets by id  */;
export const deleteAssestById = createAsyncThunk(
  'deleteAssestById ',
  async assestId => {
    try {
      const { data } = await customApi.delete(
        `/api/contractor/assets/delete-stored-assets/${assestId}`,
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

/ * api for approve and reject assests  by id and status*/;
export const approveAndRejectAssests = createAsyncThunk(
  'approveAndRejectAssests ',
  async ({ id, status }) => {
    try {
      const { data } = await customApi.put(
        `/api/contractor/assets/approve-reject-assets-by-status?status=${
          status || ''
        }&&id=${id || ''}`,
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

/ * api for send to repair, repair complete,and sent to scractch */;
export const updateStatusOfAssests = createAsyncThunk(
  'updateStatusOfAssests ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/assets/repair-assets`,
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
/ * api for assign assest to user */;
export const assignAssests = createAsyncThunk(
  'assignAssests ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/assets/assigned-asset-to-user`,
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

/ * api for updating assest  */;
export const updateAssest = createAsyncThunk('updateAssest ', async reqBody => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/assets/update-stored-assets`,
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

/ * api for adding assest  */;
export const addAssest = createAsyncThunk('addAssest ', async reqBody => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/assets/add-new-assets`,
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
