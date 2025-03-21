import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/ * api for  getting low price   detail by hsn code  */;
export const getLowPriceByHsncode = createAsyncThunk(
  'getLowPriceByHsncode ',
  async id => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/get-fund-request-4-low-price/${id}`,
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

/ * api for  getting last 3 previous peice    detail by item id and user id  */;
export const getLast3PreviousPrice = createAsyncThunk(
  'getLowPriceByHsncode ',
  async ({ itemId, userId }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/get-last-three-prev-price-of-items/${itemId}/${userId}`,
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

/ * api for  getting fund request  detail by id  */;
export const getFundRequestDetailById = createAsyncThunk(
  'getFundRequestDetailById ',
  async id => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/get-fund-request-details/${id}`,
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

const getFundRequestDetailSlice = createSlice({
  name: 'getFundRequestDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getFundRequestDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getFundRequestDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getFundRequestDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getFundRequestDetailSlice.reducer;
