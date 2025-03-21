/*    ----------------Created Date :: 26- Feb -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for deleting Work quotation by id  */;
export const deleteQuotationById = createAsyncThunk(
  'deleteQuotationById ',
  async quotationId => {
    try {
      const {data} = await customApi.delete(
        `/api/contractor/delete-quotation/${quotationId}`,
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

/ * api for approve and reject work quotation  by id and status*/;
export const approveAndRejectWorkQuotation = createAsyncThunk(
  'approveAndRejectWorkQuotation ',
  async ({id, status}) => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/approve-rejected-quotation-by-id?status=${
          status || ''
        }&&id=${id || ''}`,
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

/ * api for updating Work Work Quotation */;
export const updateWorkQuotation = createAsyncThunk(
  'updateWorkQuotation ',
  async ({reqBody, id}) => {
    try {
      const {data} = await customApi.put(
        `/api/contractor/update-quotation/${id || ''}`,
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

/ * api for adding Work Quotation */;
export const addWorkQuotation = createAsyncThunk(
  'addWorkQuotation ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/create-quotation`,
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
