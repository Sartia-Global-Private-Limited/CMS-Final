/*    ----------------Created Date :: 2- August -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import axios from 'axios';
import {store} from '../../../store';
import {apiBaseUrl} from '../../../../../config';

/ * api for  getting promotion overview  detail by id  */;
export const getPromotionOverViewDetailById = createAsyncThunk(
  'getPromotionOverViewDetailById ',
  async Id => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-payment-setting-by-id/${Id || ''}`,
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

const getPromotionOverviewDetailSlice = createSlice({
  name: 'getPromotionOverviewDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getPromotionOverViewDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      getPromotionOverViewDetailById.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getPromotionOverViewDetailById.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getPromotionOverviewDetailSlice.reducer;
