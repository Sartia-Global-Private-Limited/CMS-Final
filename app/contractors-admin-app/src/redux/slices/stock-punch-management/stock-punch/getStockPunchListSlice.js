/*    ----------------Created Date :: 23-April -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting pending stock punch  list  */;
export const getPendingSPList = createAsyncThunk(
  'getPendingSPList ',
  async ({search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-stock-punch-list?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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

/ * api for  getting approved stock punch  list  */;
export const getApprovedSPList = createAsyncThunk(
  'getApprovedSPList ',
  async ({search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-approve-stock-punch?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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

const getStockPunchListSlice = createSlice({
  name: 'getStockPunchList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending  stock punch*/
    builder.addCase(getPendingSPList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPendingSPList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPendingSPList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for approved stock punch*/
    builder.addCase(getApprovedSPList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getApprovedSPList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getApprovedSPList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getStockPunchListSlice.reducer;
