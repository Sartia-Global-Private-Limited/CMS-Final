/*    ----------------Created Date :: 6- March -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../config';
import { store } from '../../store';

/ * api for  getting Earthing testing  list  */;
export const getAllEarthingTesting = createAsyncThunk(
  'getAllEarthingTesting ',
  async ({ search, pageSize, pageNo, status }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/earthing-testing/get-earthing-testing-lists?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&status=${status || ''}`,
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

const getAllETListSlice = createSlice({
  name: 'getAllETList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllEarthingTesting.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllEarthingTesting.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllEarthingTesting.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAllETListSlice.reducer;
