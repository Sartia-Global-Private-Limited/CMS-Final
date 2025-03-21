/*    ----------------Created Date :: 23 -Oct -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/*for discarding measurement*/

export const discardMeasurementById = createAsyncThunk(
  'discardMeasurementById',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/billing/measurement/discard-measurement-details`,
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

/*for reactivating measurement*/
export const reactiveMeasurementById = createAsyncThunk(
  'reactiveMeasurementById',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/reactive-to-discard-measurements`,
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

/*for Adding measurement*/
export const addMeasurement = createAsyncThunk(
  'addMeasurement',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/billing/measurement/create-measurement`,
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
/*for updating measurement*/
export const updateMeasurement = createAsyncThunk(
  'updateMeasurement',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/billing/measurement/update-measurement-details`,
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

/*-------api for getting purchase order detail by po id ----------*/
export const getPurchaseOrderDetailByPoId = createAsyncThunk(
  'getPurchaseOrderDetailByPoId',
  async po_id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-purchase-order-details-with-items/${po_id}`,
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
