/*    ----------------Created Date :: 21- Feb -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import axios from 'axios';
import {store} from '../../store';
import {apiBaseUrl} from '../../../../config';

/ * api for  getting work Image detail by id  */;

export const getWorkImageDetailById = createAsyncThunk(
  'getWorkImageDetailById ',
  async Id => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-single-uploaded-complaint-images/${Id}`,
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

const getWorkImageDetailSlice = createSlice({
  name: 'getWorkImageDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getWorkImageDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getWorkImageDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getWorkImageDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getWorkImageDetailSlice.reducer;
