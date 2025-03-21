import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting  payment received  list  with status code */;
export const getPaymentReceivedListWithCode = createAsyncThunk(
  'getPaymentReceivedListWithCode ',
  async ({status, search, pageSize, pageNo, pvNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/payment-recieved/get-payment-received-by-status?status=${
          status || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }&&pv_number=${pvNo || ''}`,
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

const getPaymentReceivedListSlice = createSlice({
  name: 'getPaymentReceivedList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getPaymentReceivedListWithCode.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      getPaymentReceivedListWithCode.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getPaymentReceivedListWithCode.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getPaymentReceivedListSlice.reducer;
