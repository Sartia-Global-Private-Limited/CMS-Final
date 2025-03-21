import { createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for deleting  team by team id  */;
export const deleteTeamById = createAsyncThunk(
  'deleteTeamById ',
  async ({ teamId }) => {
    try {
      const { data } = await customApi.delete(
        `/api/contractor/hr-teams/delete-hr-team/${teamId}`,
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
/ * api for deleting  team by team id  */;
export const deleteMemberById = createAsyncThunk(
  'deleteMemberById ',
  async ({ reqBody }) => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/hr-teams/remove-specific-user-from-team`,
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
/ * api for deleting  team by team id  */;
export const addMemberToTeamById = createAsyncThunk(
  'addMemberToTeamById ',
  async ({ reqBody }) => {
    try {
      const { data } = await customApi.post(
        `api/contractor/add-specific-user-to-team`,
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
/ * api for deleting  team by team id  */;
export const createTeam = createAsyncThunk(
  'createTeam ',
  async ({ reqBody }) => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/hr-teams/create-hr-team`,
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
/ * api for deleting  team by team id  */;
export const updateTeam = createAsyncThunk(
  'createTeam ',
  async ({ reqBody }) => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/hr-teams/update-hr-team-details`,
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
