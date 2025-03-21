import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

/ * api for deleting TASK category by id  */;
export const deleteTaskById = createAsyncThunk('deleteTaskById ', async id => {
  try {
    const { data } = await customApi.delete(`api/contractor/delete-task/${id}`);

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/ * api for updating Task */;
export const updateTask = createAsyncThunk('updateTask ', async reqBody => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-task-list`,
      reqBody,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/ * api for adding Task  */;
export const addTask = createAsyncThunk('addTask ', async reqBody => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-task`,
      reqBody,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});
/ * api for Updating main Task status */;
export const updateMainTaskStatus = createAsyncThunk(
  'updateMainTaskStatus ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/update-main-task-status`,
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
