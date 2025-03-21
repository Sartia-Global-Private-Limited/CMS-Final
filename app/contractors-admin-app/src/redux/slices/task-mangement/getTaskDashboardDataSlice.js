/*    ----------------Created Date :: 1 -March -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';
import { store } from '../../store';
import { apiBaseUrl } from '../../../../config';

/ * api for  getting task dashboard data  */;
export const getTaskDashData = createAsyncThunk(
  'getTaskDashData ',
  async () => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/task/get-task-status-for-dashboard`,
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

const getTaskDashboardDataSlice = createSlice({
  name: 'getTaskDashboardData', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getTaskDashData.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getTaskDashData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getTaskDashData.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getTaskDashboardDataSlice.reducer;
