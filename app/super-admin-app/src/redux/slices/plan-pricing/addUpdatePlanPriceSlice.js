import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for deleting Plan and pricing  by id  */;
export const deletePlanPricingById = createAsyncThunk(
  'deletePlanPricingById ',
  async id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/plan/delete-plan/${id}`,
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

/ * api for updating Work Work Quotation */;
export const updatePlanPrice = createAsyncThunk(
  'updatePlanPrice ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/plan/update-plan-details`,
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

/ * api for adding Plan Price */;
export const addPlanPrice = createAsyncThunk('addPlanPrice ', async reqBody => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/plan/create-plan`,
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
