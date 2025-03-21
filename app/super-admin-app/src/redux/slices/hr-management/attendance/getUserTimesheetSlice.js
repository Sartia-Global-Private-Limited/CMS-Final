/*    ----------------Created Date :: 30- jan -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import moment from 'moment';
import {customApi} from '../../../../../config';

/ * api for  time sheet   list  for indivdual user by id and month*/;

export const getUserTimeSheetList = createAsyncThunk(
  'getUserTimeSheetList ',
  async ({userId, month}) => {
    const converted = moment(month).format('YYYY-MM');
    try {
      const {data} = await customApi.get(
        `/api/super-admin/hr-attendance/get-user-time-sheet/${userId}?date=${converted}`,
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

const getUserTimesheetSlice = createSlice({
  name: 'getUserTimesheet', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getUserTimeSheetList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getUserTimeSheetList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getUserTimeSheetList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getUserTimesheetSlice.reducer;
