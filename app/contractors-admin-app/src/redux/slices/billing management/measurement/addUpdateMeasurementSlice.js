/*    ----------------Created Date :: 13 -June -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {apiBaseUrl, customApi} from '../../../../../config';
import {store} from '../../../store';
import axios from 'axios';

/*for discarding measurement*/

export const discardMeasurementById = createAsyncThunk(
  'discardMeasurementById',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/discard-measurement-details`,
        reqBody,
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

/*for reactivating measurement*/
export const reactiveMeasurementById = createAsyncThunk(
  'reactiveMeasurementById',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/reactive-to-discard-measurements`,
        reqBody,
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

/*for Adding measurement*/
export const addMeasurement = createAsyncThunk(
  'addMeasurement',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/create-measurement`,
        reqBody,
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
/*for updating measurement*/
export const updateMeasurement = createAsyncThunk(
  'updateMeasurement',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `api/contractor/update-measurement-details`,
        reqBody,
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

/*-------api for getting purchase order detail by po id ----------*/
export const getPurchaseOrderDetailByPoId = createAsyncThunk(
  'getPurchaseOrderDetailByPoId',
  async po_id => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-purchase-order-details-with-items/${po_id}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
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
