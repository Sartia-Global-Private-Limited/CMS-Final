import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for deleting TASK category by id  */;
export const deleteTaskCategorytById = createAsyncThunk(
  'deleteTaskCategorytById ',
  async id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/task/delete-task-category/${id}`,
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

/ * api for updating Task category */;
export const updateTaskCategory = createAsyncThunk(
  'updateTaskCategory ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/task/update-task-category`,
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

/ * api for adding Task Category  */;
export const addTaskCategory = createAsyncThunk(
  'addTaskCategory ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/task/create-task-category`,
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
