/*    ----------------Created Date :: 3 -July -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/*for fetching all Po number fo invoice filter*/
export const getAllPoForInvoiceFilter = createAsyncThunk(
  'getAllPoForInvoiceFilter',
  async status => {
    try {
      const {data} = await customApi.get(
        `/api/contractor/get-all-po-from-proforma?status=${
          status || ''
        }&&invoice=1`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error.response.data.message || error.message,
      };
    }
  },
);
/*for fetching all Ro number fo invoice filter*/
export const getAllRoForInvoiceFilter = createAsyncThunk(
  'getAllRoForInvoiceFilter',
  async ({status, poId}) => {
    try {
      const {data} = await customApi.get(
        `/api/contractor/get-all-ro-from-proforma?status=${
          status || ''
        }&&po_id=${poId || ''}&&invoice=1`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error.response.data.message || error.message,
      };
    }
  },
);
/*for fetching all Billing from  for invoice filter*/
export const getAllBillingFromForInvoiceFilter = createAsyncThunk(
  'getAllBillingFromForInvoiceFilter',
  async ({poId, roId}) => {
    try {
      const {data} = await customApi.get(
        `/api/contractor/ro-to-billing-from-company?po_id=${
          poId || ''
        }&&ro_id=${roId || ''}&&invoice=1`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error.response.data.message || error.message,
      };
    }
  },
);
/*for fetching all Billing  to for invoice filter*/
export const getAllBillingToForInvoiceFilter = createAsyncThunk(
  'getAllBillingToForInvoiceFilter',
  async ({poId, roId, billingFromId}) => {
    try {
      const {data} = await customApi.get(
        `/api/contractor/from-billing-to-company?po_id=${poId || ''}&&ro_id=${
          roId || ''
        }&&billing_from=${billingFromId || ''}&&invoice=1`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error.response.data.message || error.message,
      };
    }
  },
);

/*Api for getting all performa list*/
export const getPerormaListBasedonIds = createAsyncThunk(
  'getPerormaListBasedonIds',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/get-all-pi-listing`,
        reqBody,
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

/*Api for getting all Measurement item  list  Performa Invoice  measuremnt id*/
export const getItemListofInoviceItem = createAsyncThunk(
  'getItemListofInoviceItem',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/contractor/get-merged-proforma-invoice/${id || ''}`,
      );

      return data;
    } catch (error) {
      return {
        stats: false,
        message: error?.message,
      };
    }
  },
);

/*Api for discarding the invoice based on id*/
export const discardInvoice = createAsyncThunk('discardInvoice', async id => {
  try {
    const {data} = await customApi.post(
      `/api/contractor/discard-invoice/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/*Api for generating the  invoice*/
export const generateInvoice = createAsyncThunk(
  'generateInvoice',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/create-invoice-data`,
        reqBody,
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

/*Api for upating the  invoice*/
export const updateInvoice = createAsyncThunk(
  'updateInvoice',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/update-invoice-data`,
        reqBody,
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
