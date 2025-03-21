import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for deleting  emloyee by emp id  */;
export const deleteEmpById = createAsyncThunk(
  'deleteEmpById ',
  async ({empId}) => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/hr-employees/delete-employee/${empId}`,
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

/ * api for upate   emloyee status by emp id  */;
export const updateEmpStatus = createAsyncThunk(
  'updateEmpStatus ',
  async ({reqBody}) => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/hr-employees/update-user-status`,
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
/ * api for add  emloyee   */;
export const addEmployee = createAsyncThunk('addEmployee', async reqBody => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/hr-employees/create-user`,
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
/ * api for update emloyee   */;
export const updateEmployee = createAsyncThunk(
  'updateEmployee',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/hr-employees/update-user`,
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
  },
);
