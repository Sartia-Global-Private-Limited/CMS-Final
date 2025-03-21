import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/ * api for  getting Fund balance list based on bank id  */;
export const getBankBalanceByBankId = createAsyncThunk(
  'getBankBalanceByBankId ',
  async ({ bankId, search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/fund/fund-balance/get-check-last-balance/${bankId}?search=${
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

const getBankBalanceListSlice = createSlice({
  name: 'getBankBalanceList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending Fund request*/
    builder.addCase(getBankBalanceByBankId.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getBankBalanceByBankId.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getBankBalanceByBankId.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getBankBalanceListSlice.reducer;
