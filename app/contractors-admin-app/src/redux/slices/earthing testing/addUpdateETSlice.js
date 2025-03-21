/*    ----------------Created Date :: 6-March -2024   ----------------- */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

/ * api for updating Earhting testing */;
export const updateEarthingTesting = createAsyncThunk(
  'updateEarthingTesting ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/update-earthing-testing-detail`,
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

/ * api for updating Earhting testing  staus*/;
export const updateEarthingTestingStaus = createAsyncThunk(
  'updateEarthingTestingStaus ',
  async ({ id, status }) => {
    try {
      const { data } = await customApi.put(
        `/api/contractor/approve-reject-earthing-testing-by-status?status=${status}&&id=${id}`,
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

/ * api for adding Earthing tessting  */;
export const addEarthingTesting = createAsyncThunk(
  'addEarthingTesting ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/earthing-testing/add-earthing-testing-report`,
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

/ * api for Get All Energy Company  */;
export const getAllEnergyCompanyList = createAsyncThunk(
  'getAllEnergyCompanyList ',
  async () => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/get-all-energy-company`,
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

export const assignEnergyCompany = createAsyncThunk(
  'assignEnergyCompany ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/assign-earthing-testing`,
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
