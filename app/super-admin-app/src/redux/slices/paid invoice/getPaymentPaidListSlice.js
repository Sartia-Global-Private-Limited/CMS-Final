import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting payment all paid bill */;
export const getAllPaidBillInPaymentPaid = createAsyncThunk(
  'getAllPaidBillInPaymentPaid ',
  async ({search, pageSize, pageNo, roId, areaManagerId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-complaints-via-invoice?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&ro=${
          roId || ''
        }&&manager_id=${areaManagerId || ''}`,
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
export const getAllPaymentPaidWithStatusCode = createAsyncThunk(
  'getAllPaymentPaidWithStatusCode ',
  async ({status, search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-payment-paid?status=${status || ''}&&search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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

const getPaymentPaidListSlice = createSlice({
  name: 'getPaymentPaidList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllPaidBillInPaymentPaid.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllPaidBillInPaymentPaid.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllPaidBillInPaymentPaid.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    builder.addCase(
      getAllPaymentPaidWithStatusCode.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getAllPaymentPaidWithStatusCode.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getAllPaymentPaidWithStatusCode.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getPaymentPaidListSlice.reducer;
