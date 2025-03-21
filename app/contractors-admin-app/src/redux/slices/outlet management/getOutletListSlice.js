/*    ----------------Created Date :: 25- July -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../config';
import { store } from '../../store';

/ * api for  getting outlet list with code */;
export const getOutletListWithCode = createAsyncThunk(
  'getOutletListWithCode ',
  async ({ status, search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/fuel-station/all-outlets?search=${
          search || ''
        }&&status=${status || ''}&&pageNo=${pageNo || ''}&&pageSize=${
          pageSize || ''
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

const getOutletListSlice = createSlice({
  name: 'getOutletList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getOutletListWithCode.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getOutletListWithCode.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getOutletListWithCode.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getOutletListSlice.reducer;
