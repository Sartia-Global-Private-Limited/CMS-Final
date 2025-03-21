/*    ----------------Created Date :: 5 -March -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../config';
import {store} from '../../store';

/ * api for  getting  profile detail  */;
export const getAllProfileDetail = createAsyncThunk(
  'getAllProfileDetail ',
  async id => {
    const {token} = store.getState().tokenAuth;

    try {
      const {data} = await axios.get(`${apiBaseUrl}/api/contractor/profile`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);

const getProfileDetailSlice = createSlice({
  name: 'getProfileDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllProfileDetail.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllProfileDetail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllProfileDetail.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getProfileDetailSlice.reducer;
