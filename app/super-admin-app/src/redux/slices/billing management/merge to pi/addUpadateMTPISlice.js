/*    ----------------Created Date :: 23 -Oct -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/*for fetching all Po number*/
export const getAllPoWithStatusCode = createAsyncThunk(
  'getAllPoWithStatusCode',
  async status => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-po-from-proforma?status=${status || ''}`,
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

/*for fetching all Ro with po id*/
export const getAllRoWithPoId = createAsyncThunk(
  'getAllPoWithStatusCode',
  async ({status, poId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-ro-from-proforma?status=${
          status || ''
        }&&po_id=${poId || ''}`,
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

/*for fetching Billing from  with po id and ro id*/
export const getAllBillingFromWithPoIdRoId = createAsyncThunk(
  'getAllBillingFromWithPoIdRoId',
  async ({poId, roId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/ro-to-billing-from-company?po_id=${
          poId || ''
        }&&ro_id=${roId || ''}`,
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

/*for fetching Billing to  with po id and ro id and billing to id*/
export const getAllBillingToWithPoIdRoId = createAsyncThunk(
  'getAllBillingToWithPoIdRoId',
  async ({poId, roId, billingFromId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/from-billing-to-company?po_id=${poId || ''}&&ro_id=${
          roId || ''
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

/*for merging performa invoice */
export const mergedPerformaInvoice = createAsyncThunk(
  'mergedPerformaInvoice',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/merged-proforma-invoice`,
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
/*for discarding merged performa invoice */
export const dicardMergedPerformaInvoice = createAsyncThunk(
  'dicardMergedPerformaInvoice',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/discard-merged-pi`,
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
