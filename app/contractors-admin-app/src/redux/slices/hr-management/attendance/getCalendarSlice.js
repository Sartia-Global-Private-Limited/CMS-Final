/*    ----------------Created Date :: 25- jan -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { store } from '../../../store';
import { apiBaseUrl } from '../../../../../config';
import moment from 'moment';

/ * api for  time sheet  list  */;

export const getCalendarList = createAsyncThunk(
  'getCalendarList ',
  async ({ calendarMonth }) => {
    {
      /* date format ==>  YYYY - MM*/
    }
    const converted = moment(calendarMonth).format('YYYY-MM');

    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/hr-attendance/get-all-users-attendance-in-calendar-view?yearMonth=${converted}`,
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

const getCalendarSlice = createSlice({
  name: 'getCalendar', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getCalendarList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getCalendarList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getCalendarList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getCalendarSlice.reducer;
