/*    ----------------Created Date :: 21 -Oct -2024   ----------------- */

import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/*APi for getting all po for ready to pi  by status code*/
export const getAllPoForReadyToPi = createAsyncThunk(
  'getAllPoForReadyToPi',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-po-filters?status=${statusCode}`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.message,
      };
    }
  },
);

/*APi for getting all ro for ready to pi by status code and po id*/
export const getAllRoForReadyToPi = createAsyncThunk(
  'getAllRoForReadyToPi',
  async ({statusCode, poId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-ro-filters?status=${statusCode}&&po_id=${poId}`,
      );
      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.message,
      };
    }
  },
);

/* Api for getting all company for ready to pi by status code ,po id and ro  id */
export const getAllCompanyForReadyToPi = createAsyncThunk(
  'getAllCompanyForReadyToPi',
  async ({statusCode, poId, roId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-complaints-in-pi?status=${statusCode}&&ro_id=${roId}&&po_id=${poId}`,
      );
      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.message,
      };
    }
  },
);

/*Api for getting all po for Performa Invoice by status code*/
export const getAllPoForPi = createAsyncThunk(
  'getAllPoForPi',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-po-from-proforma?status=${statusCode}&&invoice=`,
      );
      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.message,
      };
    }
  },
);

/*Api for getting all ro for Performa Invoice by status code ,po id*/
export const getAllRoForPi = createAsyncThunk(
  'getAllRoForPi',
  async ({statusCode, poId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-ro-from-proforma?status=${statusCode}&&po_id=${poId}&&invoice=`,
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

/*Api for getting all billing no for performa invoice by statse code,poid,roid */
export const getAllBillingNumberForPi = createAsyncThunk(
  'getAllBillingNumberForPi',
  async ({statusCode, poId, roId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-bill-number-from-proforma?status=${statusCode}&&ro_id=${roId}&&po_id=${poId}`,
      );
      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.message,
      };
    }
  },
);

export const getAllOutletForPerforma = createAsyncThunk(
  'getAllOutletForPerforma',
  async ({statusCode, poId, roId, saId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-outlet-filters?status=${statusCode}&&ro_id=${roId}&&po_id=${poId}&&sale_area_id=${saId}`,
      );
      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.message,
      };
    }
  },
);

export const getAllSalesAreaforfilter = createAsyncThunk(
  'getAllSalesAreaforfilter',
  async ({statusCode}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-sales-area-from-proforma?status=${statusCode}`,
      );
      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.message,
      };
    }
  },
);

export const getAllOrderByForBilling = createAsyncThunk(
  'getAllOrderByForBilling',
  async ({statusCode, piStatus}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-order-by-for-measurements?status=${statusCode}&pi_status=${piStatus}`,
      );
      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.message,
      };
    }
  },
);

export const getAllAreaManager = createAsyncThunk(
  'getAllAreaManager',
  async ({
    complaintType = '',
    companyId = '',
    oId = '',
    saId = '',
    roId = '',
    statusCode = '',
    poId = '',
  }) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-area-manager?status=${statusCode}&&po_id=${poId}&&ro_id=${roId}&&sale_area_id=${saId}&&outlet_id=${oId}&&company_id=${companyId}&&complaint_for=${complaintType}`,
      );
      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.message,
      };
    }
  },
);

export const getAllComplaintTypeListInvoice = createAsyncThunk(
  'getAllComplaintTypeListInvoice',
  async ({statusCode}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-complaint-types-filters?status=${statusCode}`,
      );
      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.message,
      };
    }
  },
);

/*Api for getting all Measurement list  Performa Invoice by po id and measuremnt ids*/
export const getAllMeasurementItemListPi = createAsyncThunk(
  'getAllMeasurementItemListPi',
  async ({poId, measurementIds}) => {
    const idsInStringFormat = measurementIds.toString();

    const reqBody = {po_id: poId, measurement_ids: idsInStringFormat};

    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-measurements-detail-po?po_id=${poId}&&measurement_ids=${
          idsInStringFormat || ''
        }`,
        reqBody,
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

/*Api for getting all Measurement item  list  Performa Invoice  measuremnt id*/
export const getItemListofMeasurementItemPi = createAsyncThunk(
  'getItemListofMeasurementItemPi',
  async measurementId => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-items-on-measurement-id/${measurementId || ''}`,
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

/*Api for discarding the performa invoice based on id*/
export const discardPerformaInvoice = createAsyncThunk(
  'discardPerformaInvoice',
  async id => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/discard-proforma-invoice/${id}`,
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
/*Api for generating the performa invoice*/
export const generatePerformaInvoice = createAsyncThunk(
  'generatePerformaInvoice',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/generate-proforma-invoice`,
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
/*Api for upating the performa invoice*/
export const updatePerformaInvoice = createAsyncThunk(
  'updatePerformaInvoice',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/update-proforma-invoice-details`,
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
