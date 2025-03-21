/*    ----------------Created Date :: 20- July -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl, customApi} from '../../../../../config';
import {store} from '../../../store';

/ * api for adding Payment  */;
export const addPayement = createAsyncThunk('addPayement ', async reqBody => {
  try {
    const {data} = await customApi.post(
      `/api/contractor/add-payment-to-invoice`,
      reqBody,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});
/ * api for updating Payment  */;
export const updatePayement = createAsyncThunk(
  'updatePayement ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/update-payment-received-by-id`,
        reqBody,
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

/ * api for  getting all inovoice data by ids */;
export const getAllInoviceDataByIds = createAsyncThunk(
  'getAllInoviceDataByIds ',
  async ids => {
    const {token} = store.getState().tokenAuth;
    const idsToSend = ids.join();

    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-invoice-data-by-id/${idsToSend}`,
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

const addUpdatePayementSlice = createSlice({
  name: 'addUpdatePayement', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllInoviceDataByIds.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllInoviceDataByIds.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllInoviceDataByIds.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default addUpdatePayementSlice.reducer;
