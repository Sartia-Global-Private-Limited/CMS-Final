/*    ----------------Created Date :: 25- jan -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { store } from '../../../store';
import { apiBaseUrl } from '../../../../../config';
import moment from 'moment';

/ * api for  time sheet  list  */;

export const getTimeSheetList = createAsyncThunk(
  'getTimeSheetList ',
  async ({ startDate, endDate }) => {
    {
      /* date format ==> MM - DD - YYYY*/
    }
    const convertedStartDate = moment(startDate).format('DD-MM-YYYY');
    const convertedEndDate = moment(endDate).format('DD-MM-YYYY');

    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/hr-attendance/get-all-user-time-sheet?start_date=${convertedStartDate}&&end_date=${convertedEndDate}`,
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

const getTimeSheetSlice = createSlice({
  name: 'getTimeSheet', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getTimeSheetList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getTimeSheetList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getTimeSheetList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getTimeSheetSlice.reducer;
