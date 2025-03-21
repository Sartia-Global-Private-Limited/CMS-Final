/*    ----------------Created Date :: 8 - oct -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for deleting user by id  */;
export const deleteEnergyTeamUserById = createAsyncThunk(
  'deleteEnergyTeamUserById ',
  async userId => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/oil-and-gas/delete-energy-company-user/${userId}`,
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
/ * api for getting energy area data  by id  */;
export const getEnergyAreaDataById = createAsyncThunk(
  'getEnergyAreaDataById ',
  async ({companyId, type}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-area-data-for-energy/${companyId || ''}/${
          type || ''
        }`,
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

/ * api for updating energy team  */;
export const updateEnergyTeam = createAsyncThunk(
  'updateEnergyTeam',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/oil-and-gas/update-energy-company-user`,
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

/ * api for creating energy team */;
export const createEnergyTeam = createAsyncThunk(
  'createEnergyTeam',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/oil-and-gas/create-energy-company-user`,
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
