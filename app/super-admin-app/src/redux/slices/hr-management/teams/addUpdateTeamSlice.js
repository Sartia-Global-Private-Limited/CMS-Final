import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for deleting  team by team id  */;
export const deleteTeamById = createAsyncThunk(
  'deleteTeamById ',
  async ({teamId}) => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/hr-teams/delete-team/${teamId}`,
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
  async ({reqBody}) => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/hr-teams/remove-specific-user-from-team`,
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
  async ({reqBody}) => {
    try {
      const {data} = await customApi.post(
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
export const createTeam = createAsyncThunk('createTeam ', async ({reqBody}) => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/hr-teams/create-admin-team`,
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

/ * api for deleting  team by team id  */;
export const updateTeam = createAsyncThunk('updateTeam ', async ({reqBody}) => {
  try {
    const {data} = await customApi.put(
      `/api/super-admin/hr-teams/update-team-details`,
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
