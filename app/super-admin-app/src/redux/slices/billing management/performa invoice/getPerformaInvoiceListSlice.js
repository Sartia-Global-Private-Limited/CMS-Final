/*    ----------------Created Date :: 21 -Oct -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting list of ready to  Pi  */;
export const getReadyToPiList = createAsyncThunk(
  'getReadyToPiList ',
  async ({
    search = '',
    status = '',
    pageSize = 10,
    pageNo = 1,
    poId = '',
    roId = '',
    companyId = '',
    complaintFor = '',
    complaintId = '',
    salesAreaId = '',
    financialYear = '',
    oId = '',
    complaintTypeId = '',
  }) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/performa-invoice/get-all-proforma-invoices?status=${
          status || ''
        }&&po_id=${poId || ''}&&energy_company_id=${
          companyId || ''
        }&&complaint_for=${complaintFor || ''}&&regional_office_id=${
          roId || ''
        }&&complaint_id=${complaintId || ''}&&search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }&&sale_area_id=${salesAreaId}&&financial_year=${financialYear}&& outlet_id=${oId}&&complaint_type=${complaintTypeId}`,
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
export const getPiFinalDiscardList = createAsyncThunk(
  'getPiFinalDiscardList ',
  async ({
    search = '',
    status = '',
    poId = '',
    roId = '',
    billNumber = '',
    pageSize = '',
    pageNo = '',
    salesAreaId = '',
    financialYear = '',
    oId = '',
    complaintTypeId = '',
  }) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/performa-invoice/get-all-proforma-invoices?status=${
          status || ''
        }&&po_id=${poId || ''}&&regional_office_id=${roId || ''}&&bill_number=${
          billNumber || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }&&sale_area_id=${salesAreaId}&&financial_year=${financialYear}&& outlet_id=${oId}&&complaint_type=${complaintTypeId}`,
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

const getPerformaInvoiceListSlice = createSlice({
  name: 'getPerformaInvoiceList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for list of ready to pi*/
    builder.addCase(getReadyToPiList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getReadyToPiList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getReadyToPiList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
    /*for list of discard,final and ready to pi*/
    builder.addCase(getPiFinalDiscardList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPiFinalDiscardList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getPiFinalDiscardList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getPerformaInvoiceListSlice.reducer;
