/*    ----------------Created Date :: 9- Sep -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';
import moment from 'moment';

/* Api for getting All stock punch request*/
export const getAllEmployeeHistory = createAsyncThunk(
  'getAllEmployeeHistory',
  async ({search, pageSize, pageNo, month}) => {
    const {token} = store.getState().tokenAuth;

    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-employee-history-with-complaints?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&month=${month || ''}`,
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

const getAllEmployeeHistorySlice = createSlice({
  name: 'getAllEmployeeHistory',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /* for All  expense list*/
    builder.addCase(getAllEmployeeHistory.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllEmployeeHistory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllEmployeeHistory.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAllEmployeeHistorySlice.reducer;
