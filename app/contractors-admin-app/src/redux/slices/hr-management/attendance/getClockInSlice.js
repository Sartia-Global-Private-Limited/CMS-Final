/*    ----------------Created Date :: 25- jan -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { store } from '../../../store';
import { apiBaseUrl } from '../../../../../config';

/ * api for  tisheet  list  */;

export const getClockedInUserList = createAsyncThunk(
  'getClockedInUserList ',
  async () => {
    {
      /* date format ==> MM - DD - YYYY*/
    }
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/hr-attendance/get-all-user-today-clock-in`,
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

const getClockInSlice = createSlice({
  name: 'getClockIn', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getClockedInUserList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getClockedInUserList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getClockedInUserList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getClockInSlice.reducer;
