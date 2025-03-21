import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for deleting CompanyNo FOrmat  by id  */;
export const deleteCompanyNoFomartById = createAsyncThunk(
  'deleteCompanyNoFomartById ',
  async id => {
    try {
      const { data } = await customApi.delete(
        `/api/contractor/master-data/company-format/update-company-number-format/${id}`,
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

/ * api for updating CompanyNo format */;
export const updateCompanyNoFormat = createAsyncThunk(
  'updateCompanyNoFormat ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/master-data/client-vendor-format/update-client-vendor-number-format`,
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

/ * api for adding Company No Format  */;
export const addCompanyNoFormat = createAsyncThunk(
  'addCompanyNoFormat ',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/master-data/client-vendor-format/generate-client-vendor-number-format`,
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
