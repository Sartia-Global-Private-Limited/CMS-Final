/*    ----------------Created Date :: 25- July -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import axios from 'axios';
import {store} from '../../store';
import {apiBaseUrl} from '../../../../config';

/ * api for  getting Outlets detail by id  */;
export const getOutletDetailById = createAsyncThunk(
  'getOutletDetailById ',
  async Id => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-outlet/${Id}`,
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

const getOutletDetailSlice = createSlice({
  name: 'getOutletDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getOutletDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getOutletDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getOutletDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getOutletDetailSlice.reducer;
