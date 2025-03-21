/*    ----------------Created Date :: 23 -Oct -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting list of  invoice final and discard */;
export const getInvoiceFinalDiscardList = createAsyncThunk(
  'getInvoiceFinalDiscardList ',
  async ({
    search,
    status,
    pageSize,
    pageNo,
    poId,
    roId,
    billingToId,
    billingFromId,
  }) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/invoice/get-all-invoice-data?status=${
          status || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }&&po_id=${poId || ''}&&ro_id=${roId || ''}&&billing_to=${
          billingToId || ''
        }&&billing_from=${billingFromId || ''}`,
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

/ * api for  getting list of performa invoice,discard,final and ready to pi measurement */;
export const getReadyToInvoiceList = createAsyncThunk(
  'getReadyToInvoiceList ',
  async ({
    search,
    poId,
    roId,
    billingToId,
    billingFromId,
    pageSize,
    pageNo,
  }) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/invoice/get-all-listing-pi-and-mpi?po_id=${
          poId || ''
        }&&regional_office_id=${roId || ''}&&billing_from=${
          billingFromId || ''
        }&&billing_to=${billingToId || ''}&&search=${search || ''}&&pageSize=${
          pageSize || ''
        }&&pageNo=${pageNo || ''}`,
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

const getInovoiceListSlice = createSlice({
  name: 'getInovoiceList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for list of ready to pi*/
    builder.addCase(getInvoiceFinalDiscardList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getInvoiceFinalDiscardList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getInvoiceFinalDiscardList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
    /*for list of discard,final and ready to pi*/
    builder.addCase(getReadyToInvoiceList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getReadyToInvoiceList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getReadyToInvoiceList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getInovoiceListSlice.reducer;
