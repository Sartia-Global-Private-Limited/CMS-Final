import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for deleting EmployeeNo FOrmat  by id  */;
export const deleteEmployeeNoFomartById = createAsyncThunk(
  'deleteEmployeeNoFomartById ',
  async id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/master-data/employee-format/update-employee-number-format/${id}`,
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

/ * api for updating EmployeeNo format */;
export const updateEmployeeNoFormat = createAsyncThunk(
  'updateEmployeeNoFormat ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/master-data/employee-format/update-employee-number-format`,
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

/ * api for adding EmployeeNo Format  */;
export const addEmployeeNoFormat = createAsyncThunk(
  'addEmployeeNoFormat ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/master-data/employee-format/generate-employee-number-format`,
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
