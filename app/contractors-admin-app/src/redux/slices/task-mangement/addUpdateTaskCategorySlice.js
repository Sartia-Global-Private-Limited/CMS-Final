import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

/ * api for deleting TASK category by id  */;
export const deleteTaskCategorytById = createAsyncThunk(
  'deleteTaskCategorytById ',
  async id => {
    try {
      const { data } = await customApi.delete(
        `/api/contractor/task/delete-task-category/${id}`,
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
      const { data } = await customApi.post(
        `/api/contractor/task/update-task-category`,
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
      const { data } = await customApi.post(
        `/api/contractor/task/create-task-category`,
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
