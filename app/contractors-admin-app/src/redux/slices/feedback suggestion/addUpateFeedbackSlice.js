import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

/ * api for deleting feedback by id  */;
export const deleteFeedbackById = createAsyncThunk(
  'deleteFeedbackById ',
  async feedbackId => {
    try {
      const { data } = await customApi.delete(
        `/api/contractor/feedback-suggestion/delete-feedback-and-complaint/${feedbackId}`,
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

/ * api for adding response*/;
export const addResponse = createAsyncThunk(
  'addResponse ',
  async ({ reqBody, feedbackId }) => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/feedback-suggestion/add-response/${feedbackId || ''}`,
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

/ * api for creating feedback*/;
export const createFeedback = createAsyncThunk(
  'createFeedback ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/feedback-suggestion/create-feedback-and-complaint`,
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
