/*    ----------------Created Date :: 5- Feb -2024    ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { store } from '../../../store';
import { apiBaseUrl } from '../../../../../config';

/ * api for  FNF Resignation  statement   list*/;
export const getFnfList = createAsyncThunk('getFnfList ', async () => {
  const { token } = store.getState().tokenAuth;

  try {
    const { data } = await axios.get(
      `${apiBaseUrl}/api/contractor/payroll/resignation/get-fnf-statements`,
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

const getFnfResignationSlice = createSlice({
  name: 'getFnfResignation', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getFnfList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getFnfList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getFnfList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getFnfResignationSlice.reducer;
