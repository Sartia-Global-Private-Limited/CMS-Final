/*    ----------------Created Date :: 22- jan -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { store } from '../../../store';
import { apiBaseUrl } from '../../../../../config';

/ * api for  getting employee list  */;

export const getEmployeeList = createAsyncThunk(
  'getEmployeeList ',
  async ({ search, pageSize, pageNo, isDropdown }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/hr-employees/get-all-employees?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&${
          isDropdown || ''
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

const getEmployeeListSlice = createSlice({
  name: 'getEmployeeList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getEmployeeList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getEmployeeList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getEmployeeList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getEmployeeListSlice.reducer;
