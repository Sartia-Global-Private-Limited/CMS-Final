/*    ----------------Created Date :: 3 - August -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/*for fetching all Ro  for Payment paid  filter*/
export const getAllRoForPaymentPaidFilter = createAsyncThunk(
  'getAllRoForPaymentPaidFilter',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/contractor/get-ro-in-paid-payment`,
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
/*for fetching all Po  for Payment paid  filter*/
export const getAllPoForPaymentPaidFilter = createAsyncThunk(
  'getAllPoForPaymentPaidFilter',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/contractor/get-po-in-paid-payment`,
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

/*for fetching all area manager for payment paid filter*/
export const getAllAreaManagerForPaymentPaidFilter = createAsyncThunk(
  'getAllAreaManagerForPaymentPaidFilter',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/contractor/get-area-manager-in-paid-payment`,
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

/ * api for creating payment paid */;
export const addPaymentPaymentPaid = createAsyncThunk(
  'addPaymentPaymentPaid ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/payment-paid`,
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

/ * api for resending otp in payment paid */;
export const resendOtpPaymentPaid = createAsyncThunk(
  'resendOtpPaymentPaid ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/resend-otp-in-payment-paid`,
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
/ * api for verify otp in payment paid */;
export const verifyOtpPaymentPaid = createAsyncThunk(
  'verifyOtpPaymentPaid ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/contractor/otp-verify-in-payment-paid`,
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
