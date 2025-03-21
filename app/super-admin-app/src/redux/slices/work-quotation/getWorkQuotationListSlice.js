/*    ----------------Created Date :: 11- July -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting  Qututaition   list  with status code */;
export const getQuotationListWithCode = createAsyncThunk(
  'getQuotationListWithCode ',
  async ({status, search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/quotations/get-quotation?status=${
          status || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }`,
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
