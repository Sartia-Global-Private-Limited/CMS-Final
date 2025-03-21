/*    ----------------Created Date :: 4- March -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for deleting Tutorial   by id  */;
export const deleteTutorialById = createAsyncThunk(
  'deleteTutorialById ',
  async id => {
    try {
      const {data} = await customApi.delete(
        `/api/contractor/delete-tutorial/${id}`,
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

/ * api for updating Tutorail */;
export const updateTutorial = createAsyncThunk(
  'updateTutorial ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/update-tutorial-details`,
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

/ * api for adding Tutorial  */;
export const addTutorial = createAsyncThunk('addTutorial ', async reqBody => {
  try {
    const {data} = await customApi.post(
      `/api/contractor/create-tutorial`,
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
