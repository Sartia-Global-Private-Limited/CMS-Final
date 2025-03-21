/*    ----------------Created Date :: 23- July -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting payment all paid bill */;
export const getAllPaidBillInRetention = createAsyncThunk(
  'getAllPaidBillInRetention ',
  async ({search, pageSize, pageNo, pvNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-payment-received-in-retention-by-status?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&pv_number=${
          pvNo || ''
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
/ * api for  getting payment all retention money list with status code */;
export const getAllRetention = createAsyncThunk(
  'getAllRetention ',
  async ({status, search, pageSize, pageNo, po, ro, retention}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-payment-retention?retention_status=${
          status || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }&&billing_ro=${ro || ''}&&po_number=${po || ''}&&retention_id=${
          retention || ''
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

const getRetentionMoneyListSlice = createSlice({
  name: 'getRetentionMoneyList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllPaidBillInRetention.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllPaidBillInRetention.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllPaidBillInRetention.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    builder.addCase(getAllRetention.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllRetention.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllRetention.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getRetentionMoneyListSlice.reducer;
