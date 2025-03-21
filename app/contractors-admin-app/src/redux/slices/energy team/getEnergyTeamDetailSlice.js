/*    ----------------Created Date :: 8-August -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../config';
import { store } from '../../store';

/ * api for  getting Energy team detail by id  */;
export const getEnergyTeamDetailById = createAsyncThunk(
  'getEnergyTeamDetailById ',
  async ({ id, userId }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/oil-and-gas/get-energy-company-users?id=${id}&&user_id=${
          userId || ''
        }`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
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

const getEnergyTeamDetailSlice = createSlice({
  name: 'getEnergyTeamDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getEnergyTeamDetailById.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getEnergyTeamDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });

    builder.addCase(getEnergyTeamDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getEnergyTeamDetailSlice.reducer;
