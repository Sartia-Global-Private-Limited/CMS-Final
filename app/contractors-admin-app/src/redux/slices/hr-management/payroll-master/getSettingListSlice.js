/*    ----------------Created Date :: 1- Feb -2024    ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { store } from '../../../store';
import { apiBaseUrl } from '../../../../../config';

/ * api for  setting    list*/;

export const getSettingList = createAsyncThunk('getSettingList ', async () => {
  const { token } = store.getState().tokenAuth;

  try {
    const { data } = await axios.get(
      `${apiBaseUrl}/api/contractor/payroll/payroll-master/get-all-payroll-master-settings`,
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
});

const getSettingListSlice = createSlice({
  name: 'getSettingList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getSettingList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSettingList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getSettingList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSettingListSlice.reducer;
