/*    ----------------Created Date :: 9 -July -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/*for fetching all Po number for merge to invoice filter*/
export const getAllPoForMTIFilter = createAsyncThunk(
  'getAllPoForMTIFilter',
  async ({status}) => {
    try {
      const {data} = await customApi.get(
        `/api/contractor/get-all-po-for-invoices?status=${status || ''}`,
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
/*for fetching all Ro  for merge to invoice filter*/
export const getAllRoForMTIFilter = createAsyncThunk(
  'getAllRoForMTIFilter',
  async ({status, poId}) => {
    try {
      const {data} = await customApi.get(
        `/api/contractor/get-all-ro-for-invoice?status=${status || ''}&&po_id=${
          poId || ''
        }`,
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
/*for fetching all Billing from  for merge to invoice filter*/
export const getAllBillingFromForMTIFilter = createAsyncThunk(
  'getAllBillingFromForMTIFilter',
  async ({status, poId, roId}) => {
    try {
      const {data} = await customApi.get(
        `/api/contractor/get-all-billing_from-company-invoice?status=${
          status || ''
        }&&po_id=${poId || ''}&&ro_id=${roId || ''}`,
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
/*for fetching all Billing  to for merge to invoice filter*/
export const getAllBillingToForMTIFilter = createAsyncThunk(
  'getAllBillingToForMTIFilter',
  async ({status, poId, roId, billingFromId}) => {
    try {
      const {data} = await customApi.get(
        `/api/contractor/get-all-billing-to-company-invoice?status=${
          status || ''
        }&&po_id=${poId || ''}&&ro_id=${roId || ''}&&billing_from=${
          billingFromId || ''
        }`,
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

/*Api for discarding the merged invoice based on id*/
export const discardMergedInvoice = createAsyncThunk(
  'discardMergedInvoice',
  async id => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/discard-merged-invoice/${id}`,
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

/*Api for merging the invoice*/
export const mergeInvoice = createAsyncThunk('mergeInvoice', async reqBody => {
  try {
    const {data} = await customApi.post(
      `/api/contractor/merge-invoice`,
      reqBody,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});
