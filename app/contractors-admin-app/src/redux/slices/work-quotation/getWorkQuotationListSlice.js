/*    ----------------Created Date :: 11- July -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../config';
import {store} from '../../store';

/ * api for  getting  Qututaition   list  with status code */;
export const getQuotationListWithCode = createAsyncThunk(
  'getQuotationListWithCode ',
  async ({status, search, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-quotation?status=${
          status || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
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

const getWorkQuotationListSlice = createSlice({
  name: 'getWorkQuotationList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getQuotationListWithCode.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getQuotationListWithCode.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getQuotationListWithCode.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getWorkQuotationListSlice.reducer;
