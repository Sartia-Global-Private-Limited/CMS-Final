import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  Pending loan    list*/;
export const getPendingLoanList = createAsyncThunk(
  'getPendingLoanList ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/payroll/loan/get-all-loans-pending`,
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

/ * api for getting Active loan    list*/;
export const geActiveLoanList = createAsyncThunk(
  'geActiveLoanList ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/payroll/loan/get-all-loans-active`,
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
/ * api for getting rejected loan    list*/;
export const getRejectedLoanList = createAsyncThunk(
  'getRejectedLoanList',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/payroll/loan/get-all-loans-reject`,
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

/ * api for  getting closed loan    list*/;
export const getClosedLoanList = createAsyncThunk(
  'getClosedLoanList',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/payroll/loan/get-all-loans-closed`,
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

const getLoanListSlice = createSlice({
  name: 'getLoanList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending list*/
    builder.addCase(getPendingLoanList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPendingLoanList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPendingLoanList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for active list*/
    builder.addCase(geActiveLoanList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(geActiveLoanList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(geActiveLoanList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for rejected list*/
    builder.addCase(getRejectedLoanList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getRejectedLoanList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getRejectedLoanList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for closed list*/
    builder.addCase(getClosedLoanList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getClosedLoanList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getClosedLoanList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getLoanListSlice.reducer;
