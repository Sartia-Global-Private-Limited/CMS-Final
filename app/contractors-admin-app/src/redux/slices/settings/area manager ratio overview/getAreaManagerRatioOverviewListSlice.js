/*    ----------------Created Date :: 2- Aug -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting All area manager ratio overview list  */;
export const getAllAreaMangerRatioOverview = createAsyncThunk(
  'getAllAreaMangerRatioOverview ',
  async ({status, search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-promotional-manager?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&status=`,
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

const getAreaManagerRatioOverviewListSlice = createSlice({
  name: 'getAreaManagerRatioOverviewList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllAreaMangerRatioOverview.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      getAllAreaMangerRatioOverview.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(getAllAreaMangerRatioOverview.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAreaManagerRatioOverviewListSlice.reducer;
