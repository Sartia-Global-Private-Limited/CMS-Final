import {createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../config';

/* api for getting all users */
export const getAllUsers = createAsyncThunk('getAllUsers ', async () => {
  try {
    const {data} = await customApi.get(`/api/super-admin/get-all-users`);

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/*Api for getting all gst type */
export const getAllGstType = createAsyncThunk('getAllGstType', async () => {
  try {
    const {data} = await customApi.get(`api/super-admin/get-all-gst-type`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});
/* api for getting all active company list */
export const getAllActiveCompanyList = createAsyncThunk(
  'getAllActiveCompanyList ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-active-energy-companies`,
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

// Get Energy Company Assign Zone
export const getAdminEnergyCompanyassignZone = createAsyncThunk(
  'getAdminEnergyCompanyassignZone ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-energy-company-assign-zones/${id}`,
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
// Get regional office based on zone id
export const getAllRegionalOfficeByZoneId = createAsyncThunk(
  'getAllRegionalOfficeByZoneId ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-regional-office-on-zone-id/${id}`,
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

/* api for getting all company list */
export const getAllCompanyList = createAsyncThunk(
  'getAllCompanyList ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-company-details`,
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

/* api for getting My company list */
export const getAllMyCompanyList = createAsyncThunk(
  'getAllMyCompanyList ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-my-company-list`,
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
/* api for getting Sales company list */
export const getAllSalesCompanyList = createAsyncThunk(
  'getAllSalesCompanyList ',
  async ({isDropdown = false}) => {
    try {
      const {data} = await customApi.get(
        `api/super-admin/company/client/all-sale-companies?isDropdown=${isDropdown}`,
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

/* api for getting all Position list */
export const getAllPositionList = createAsyncThunk(
  'getAllPositionList ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-stored-company-contact-positions`,
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

/* api for getting all complaint list */
export const getAllComplaintList = createAsyncThunk(
  'getAllComplaintList ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-complaint-types`,
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

/* api for getting all PO list */
export const getAllPoList = createAsyncThunk('getAllPoList ', async () => {
  try {
    const {data} = await customApi.get(`/api/super-admin/get-all-po-details`);

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/* api for getting all state list */
export const getAllStateList = createAsyncThunk(
  'getAllStateList ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-state-details`,
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

/* api for getting all outlet list for drop down */
export const getAllOutlet = createAsyncThunk('getAllOutlet ', async () => {
  try {
    const {data} = await customApi.get(
      `api/super-admin/get-all-outlet-for-dropdown`,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/* api for getting all outlet list with zone */
export const getAllOutletList = createAsyncThunk(
  'getAllOutletList ',
  async () => {
    try {
      const {data} = await customApi.get(`/api/super-admin/get-outlet-list`);

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);

/* api for getting all outlet list with zone */
export const getAllBillingType = createAsyncThunk(
  'getAllBillingType ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-billing-types?search=&&pageSize=&&pageNo=`,
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

/* api for getting all outlet by sa id  */
export const getOutletBySaId = createAsyncThunk(
  'getOutletBySaId ',
  async saId => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-outlet-by-sale-area/${saId}`,
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

/* api for getting all Module id  */
export const getAllModule = createAsyncThunk('getAllModule ', async () => {
  try {
    const {data} = await customApi.get(`api/super-admin/get-all-module`);

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/* api for getting ALL BANK LIST  */
export const getAllBank = createAsyncThunk('getAllBank ', async () => {
  try {
    const {data} = await customApi.get(`/api/super-admin/get-all-bank-list`);

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/* api for getting ALL Account LIST  of particular bank using bank id */
export const getAllAccount = createAsyncThunk(
  'getAllAccount ',
  async bank_id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-bank-to-account/${bank_id}`,
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
/* api for getting ALL complaint LIST  of particular regional office by ro  id */
export const getAllComplaintListByRoId = createAsyncThunk(
  'getAllComplaintListByRoId ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-regional-office-to-complaints/${id}`,
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

/* api for getting ALL complaint LIST  of particular by user  id */
export const getAllComplaintListByUserId = createAsyncThunk(
  'getAllComplaintListByUserId ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-area-manager-to-complaints/${id}`,
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

/* api for getting walet detail by user  id */
export const getWalletDetailByUserId = createAsyncThunk(
  'getWalletDetailByUserId ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-user-wallet-details/${id}`,
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
/* api for getting Fund Item list by user  id */
export const getFundItemListByUserId = createAsyncThunk(
  'getFundItemListByUserId ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-user-fund-items-lists/${id}`,
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
/* api for getting approve item price by item Id && user  id */
export const getApproveItemPriceByUserId = createAsyncThunk(
  'getApproveItemPriceByUserId ',
  async ({itemId, userId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-approve-item-price/${itemId}/${userId}`,
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

/* api for getting Stock Item list by user  id */
export const getStockItemListByUserId = createAsyncThunk(
  'getStockItemListByUserId ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-user-stock-items-lists/${id}`,
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

/* api for getting approve Stock item price by item Id && user  id */
export const getApproveStockItemPriceByUserId = createAsyncThunk(
  'getApproveStockItemPriceByUserId ',
  async ({itemId, userId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/stock-punch-get-approve-item-price/${itemId}/${userId}`,
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

/* api for getting Previous balance by user id  for fund transfer*/
export const getPreviousBalance = createAsyncThunk(
  'getPreviousBalance ',
  async userId => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-fund-request-details-by-request-for/${userId}`,
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

/* api for getting Previous balance by user id for stock transfer */
export const getPreviousBalanceForStock = createAsyncThunk(
  'getPreviousBalanceForStock ',
  async userId => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-stock-request-details-by-request-for/${userId}`,
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

/* api for getting all outlet list for drop down  for filtering the data */
export const getAllOutletWithStatus = createAsyncThunk(
  'getAllOutletWithStatus ',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `api/super-admin/get-all-outlet-by-id-new?status=${statusCode || ''}`,
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

/* api for getting all sales area list for drop down */
export const getAllSalesArea = createAsyncThunk(
  'getAllSalesArea ',
  async () => {
    try {
      const {data} = await customApi.get(`/api/super-admin/active-sales-area`);

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);

/* api for getting all sales area by Ro id */
export const getSalesRAOnRoId = createAsyncThunk(
  'getSalesRAOnRoId ',
  async roId => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-sales-area-on-ro-id/${roId}`,
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

/* api for getting all distrcit by sales area id */
export const getAllDistrictBySaId = createAsyncThunk(
  'getAllDistrictBySaId ',
  async saId => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-district-on-sale-area-id/${saId}`,
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
/* api for getting all emp list by role id */
export const getAllEmployeeListByRoleId = createAsyncThunk(
  'getAllEmployeeListByRoleId ',
  async roleId => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-users/${roleId || ''}`,
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

/* api for getting all sales area list for drop down for filter */
export const getAllSalesAreaWithStatus = createAsyncThunk(
  'getAllSalesAreaWithStatus ',
  async stausCode => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-sales-by-id-new?status=${stausCode || ''}`,
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
/* api for getting all regional office list for drop down */
export const getAllRegionalOffice = createAsyncThunk(
  'getAllRegionalOffice ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-regional-office-details`,
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
/* api for getting all regional office list for drop down for Filter */
export const getAllRegionalOfficeWithStatus = createAsyncThunk(
  'getAllRegionalOfficeWithStatus ',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-regional-by-id-new?status=${
          statusCode || ''
        }`,
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

export const getAllCompanyForPTM = createAsyncThunk(
  'getAllCompanyForPTM ',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-companies-in-ptm?status=${statusCode || ''}`,
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
export const getAllCompanyForBilling = createAsyncThunk(
  'getAllCompanyForBilling ',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-companies-in-billing?status=${
          statusCode || ''
        }`,
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

/* api for getting all regional office list for drop down for office stock inspection */
export const getAllRoOfficeStockInspection = createAsyncThunk(
  'getAllRoOfficeStockInspection ',
  async ({statusCode}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-office-regional-list?status=${statusCode || ''}`,
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

/* api for getting all Sales Area list for drop down for office stock inspection */
export const getAllSaOfficeStockInspection = createAsyncThunk(
  'getAllSaOfficeStockInspection ',
  async ({statusCode}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-office-sales-area?status=${statusCode || ''}`,
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

/* api for getting all outlet list for drop down for office stock inspection */
export const getAllOutletOfficeStockInspection = createAsyncThunk(
  'getAllOutletOfficeStockInspection ',
  async ({statusCode}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-office-outlet?status=${statusCode || ''}`,
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

/* api for getting all regional office list for drop down for office fund inspection */
export const getAllRoOfficeFundInspection = createAsyncThunk(
  'getAllRoOfficeFundInspection ',
  async ({statusCode}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-regional-office-expense-by-id-for-fund?status=${
          statusCode || ''
        }`,
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

/* api for getting all Sales Area list for drop down for office fund inspection */
export const getAllSaOfficeFundInspection = createAsyncThunk(
  'getAllSaOfficeFundInspection ',
  async ({statusCode}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-sales-area-office-by-id-for-fund?status=${
          statusCode || ''
        }`,
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

/* api for getting all outlet list for drop down for office Fund inspection */
export const getAllOutletOfficeFundInspection = createAsyncThunk(
  'getAllOutletOfficeFundInspection ',
  async ({statusCode}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-outlet-office-by-id-for-fund?status=${
          statusCode || ''
        }`,
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

/* api for getting all regional office list for drop down for site stock inspection */
export const getAllRoSiteStockInspection = createAsyncThunk(
  'getAllRoSiteStockInspection ',
  async ({statusCode}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-office-regional-list?status=${
          statusCode || ''
        }&&siteFor=1`,
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

/* api for getting all Sales Area list for drop down for site stock inspection */
export const getAllSaSiteStockInspection = createAsyncThunk(
  'getAllSaSiteStockInspection ',
  async ({statusCode}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-office-sales-area?status=${
          statusCode || ''
        }&&siteFor=1`,
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

/* api for getting all outlet list for drop down for site stock inspection */
export const getAllOutletSiteStockInspection = createAsyncThunk(
  'getAllOutletSiteStockInspection ',
  async ({statusCode}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-office-outlet?status=${
          statusCode || ''
        }&&siteFor=1`,
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

/* api for getting all regional office list for drop down for site fund inspection */
export const getAllRoSiteFundInspection = createAsyncThunk(
  'getAllRoSiteFundInspection ',
  async ({statusCode}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-regional-office-expense-by-id-for-fund?status=${
          statusCode || ''
        }&&siteFor=1`,
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

/* api for getting all Sales Area list for drop down for site fund inspection */
export const getAllSaSiteFundInspection = createAsyncThunk(
  'getAllSaSiteFundInspection ',
  async ({statusCode}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-sales-area-office-by-id-for-fund?status=${
          statusCode || ''
        }&&siteFor=1`,
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

/* api for getting all outlet list for drop down for site fund inspection */
export const getAllOutletSiteFundInspection = createAsyncThunk(
  'getAllOutletSiteFundInspection ',
  async ({statusCode}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-outlet-office-by-id-for-fund?status=${
          statusCode || ''
        }&&siteFor=1`,
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

/* api for getting all order by list for drop down */
export const getAllOrderBy = createAsyncThunk('getAllOrderBy ', async () => {
  try {
    const {data} = await customApi.get(
      `/api/super-admin/get-all-regional-order-by`,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/* api for getting all order by list for drop down for filter  */
export const getAllOrderByWithStatus = createAsyncThunk(
  'getAllOrderByWithStatus ',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-order-by-id-new?status=${statusCode || ''}`,
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

/* api for getting Process to measurement outlet list for drop down for filter  */
export const getAllPTMOutletWithStatus = createAsyncThunk(
  'getAllPTMOutletWithStatus ',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-outlets-in-ptm?status=${statusCode || ''}`,
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

/* api for getting Process to measurement regional office list for drop down for filter  */
export const getAllPTMRegionalOfficeWithStatus = createAsyncThunk(
  'getAllPTMRegionalOfficeWithStatus ',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-regionals-in-ptm?status=${statusCode || ''}`,
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
/* api for getting Process to measurement sales area list for drop down for filter  */
export const getAllPTMSalesAreaWithStatus = createAsyncThunk(
  'getAllPTMSalesAreaWithStatus ',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-sale-in-ptm?status=${statusCode || ''}`,
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

/* api for getting Process to measurement order  by list for drop down for filter  */
export const getAllPTMOrderByWithStatus = createAsyncThunk(
  'getAllPTMOrderByWithStatus ',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-order-by-in-ptm?status=${statusCode || ''}`,
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

/* api for getting Billing outlet list for drop down for filter  */
export const getAllBillingOutletWithStatus = createAsyncThunk(
  'getAllBillingOutletWithStatus ',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-outlet-in-billing?status=${statusCode || ''}`,
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

/* api for getting Billing regional office list for drop down for filter  */
export const getAllBillingRegionalOfficeWithStatus = createAsyncThunk(
  'getAllBillingRegionalOfficeWithStatus ',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-regional-in-billing?status=${
          statusCode || ''
        }`,
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
/* api for getting Billing sales area list for drop down for filter  */
export const getAllBillingSalesAreaWithStatus = createAsyncThunk(
  'getAllBillingSalesAreaWithStatus ',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-sales-in-billing?status=${statusCode || ''}`,
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

/* api for getting Billing order  by list for drop down for filter  */
export const getAllBillingOrderByWithStatus = createAsyncThunk(
  'getAllBillingOrderByWithStatus ',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-order-by-for-measurements?status=${
          statusCode || ''
        }`,
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

/* api for getting all manger list for drop down for filter  */
export const getAllMangerAssinged = createAsyncThunk(
  'getAllMangerAssinged ',
  async () => {
    try {
      const {data} = await customApi.get(
        `api/super-admin/get-area-manager-assign`,
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

/* api for getting all manger list for drop down for filter  */
export const getAllMangerListForPromotional = createAsyncThunk(
  'getAllMangerListForPromotional ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-manager-list-with-total-free-end-users?search=&&pageSize=&&pageNo=&&status=`,
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

/* api for getting all supervisor list for drop down for filter  */
export const getAllSupervisorAssigned = createAsyncThunk(
  'getAllSupervisorAssigned ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-supervisor-assign?id=${id}`,
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

/* api for getting all assigned end user list for drop down for filter  */
export const getAllEndUserAssigned = createAsyncThunk(
  'getAllEndUserAssigned ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-end-user-assign?id=${id}`,
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

/ * api for  getting item maste data for dropdown  */;
export const getItemMasterDropDown = createAsyncThunk(
  'getItemMasterDropDown ',
  async ({category = ''}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-item-master-for-dropdown?category=${category}`,
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

/ * api for  getting all unit  list data dropdown  */;
export const getAllUnit = createAsyncThunk('getAllUnit ', async () => {
  try {
    const {data} = await customApi.get(
      `/api/super-admin/get-all-unit-data-list`,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/ * api for  getting all brand  list data dropdown  */;
export const getAllBrand = createAsyncThunk('getAllBrand ', async () => {
  try {
    const {data} = await customApi.get(
      `/api/super-admin/get-all-brand-markdown`,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/ * api for all insurance company list for dropdown  */;
export const getInsuranceCompanyList = createAsyncThunk(
  'getInsuranceCompanyList ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-insurance-company-list`,
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

/ * api for all plan of insurance company by company id list   */;
export const getPlansForInsuranceCompanny = createAsyncThunk(
  'getInsuranceCompanyList ',
  async companyId => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-plans-of-insurance-company/${companyId}`,
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

/ * api for  getting complaintlist  for dropdown  */;
export const getCompliantDropDown = createAsyncThunk(
  'getCompliantDropDown ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-complaints-list-dropdown`,
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

/ * api for  getting complaintlist  for dropdown  */;
export const getAllCompliant = createAsyncThunk(
  'getAllCompliant ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-complaint-list`,
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

/ * api for  getting getAllManger  */;
export const getAllManger = createAsyncThunk(
  'getAllManger',
  async ({team = ''}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-managers-users?team=${team}`,
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
/ * api for  getting all supplier list  */;
export const getAllSupplier = createAsyncThunk('getAllSupplier ', async () => {
  try {
    const {data} = await customApi.get(
      `/api/super-admin/get-suppliers?search=&&pageSize=&&pageNo=&&isDropdown=true&&status`,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/ * api for  getting all Pv number list  */;
export const getAllPvNumberWithStatusCode = createAsyncThunk(
  'getAllPvNumberWithStatusCode ',
  async statusCode => {
    try {
      const {data} = await customApi.get(
        `api/super-admin/listing-pv-number?status=${statusCode || ''}`,
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

/ * api for  getting all roles  */;
export const getAllRoles = createAsyncThunk('getAllRoles ', async () => {
  try {
    const {data} = await customApi.get(
      `/api/super-admin/get-all-roles-for-dropdown`,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});
/ * api for  getting all users by role id  */;
export const getAdminUsersbyRole = createAsyncThunk(
  'getAdminUsersbyRole ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-users-by-role/${id}`,
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

/ * api for  getting getAllUserWithoutTeam   */;
export const getAllUserWithoutTeam = createAsyncThunk(
  'getAllUserWithoutTeam ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/hr-teams/get-admin-users-list-without-team`,
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

/ * api for  getting All payment method list  */;
export const getAllPaymentMethod = createAsyncThunk(
  'getAllPaymentMethod ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-payment-methods`,
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
/ * api for  getting get All Supervisor By MangaerId   */;
export const getAllSupervisorByMangaerId = createAsyncThunk(
  'getAllSupervisorByMangaerId ',
  async ({managerId, type = ''}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-supervisor-by-manager-with-count-free-end-users/${managerId}?type=${type}`,
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

export const getAllEndUserBySupervisorId = createAsyncThunk(
  'getAllEndUserBySupervisorId',
  async supervisor_id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-end-users-by-supervisor/${supervisor_id}`,
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

/ * api for  user  details by complaint  id  */;
export const getUserDetailByComplaintId = createAsyncThunk(
  'getUserDetailByComplaintId ',
  async ({complaintId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-user-details-by-complaint-id/${complaintId}`,
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
/ * api for get all user list  by team  id  */;
export const getAllUserListByTeamId = createAsyncThunk(
  'getAllUserListByTeamId ',
  async ({teamId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-users-list-to-add-in-team/${teamId}`,
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

/ * api for manager  details by user  id  */;
export const getManagerDetailByUserId = createAsyncThunk(
  'getManagerDetailByUserId ',
  async ({userId}) => {
    try {
      const {data} = await customApi.get(
        `api/super-admin/get-area-manager-of-user/${userId}`,
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

/ * api for get stock  details by item and  user  id  */;
export const getStockDetailByItemIdUserId = createAsyncThunk(
  'getStockDetailByItemIdUserId ',
  async ({itemId, userId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-stock-details-on-item-id/${itemId}/${
          userId ? userId : 0
        }`,
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

/ * api for  getting fund request details on item id  */;
export const getFundRequestDetailByItemId = createAsyncThunk(
  'getFundRequestDetailByItemId ',
  async ({itemId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-fund-request-details-on-item-id/${itemId}`,
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

/* api for getting stock detail on item id and user id*/
export const getStockRequestDetailByItemId = createAsyncThunk(
  'getStockRequestDetailByItemId',
  async ({itemId, userId}) => {
    try {
      const {data} = await customApi.get(
        `api/super-admin/get-stock-details-on-item-id/${itemId}/${userId}`,
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

/ * api for  getting all employeelist  */;
export const getAllEmplist = createAsyncThunk('getAllEmplist ', async () => {
  try {
    const {data} = await customApi.get(
      `/api/super-admin/get-all-employees?search=&&pageSize=&&pageNo=&&isDropdown=false`,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});
/ * api for  getting all leavetype  */;
export const getLeaveTypelist = createAsyncThunk(
  'getLeaveTypelist ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-leave-type?search=&&pageSize=&&pageNo=`,
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

/ * api for changing the status of allocated complaint  */;
export const updateAllocateComplaintStatus = createAsyncThunk(
  'updateAllocateComplaintStatus ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/update-allocate-complaints`,
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

/ * api for  creating stock punch  */;
export const createStockPunch = createAsyncThunk(
  'createStockPunch ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/stock-punch`,
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

/ * api for  creating expense punch  */;
export const createExpensePunch = createAsyncThunk(
  'createStockRequest ',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/add-expense-punch`,
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
/* api for getting all financial year for dashboard */
export const getAllDashboardFY = createAsyncThunk(
  'getAllDashboardFY ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/fetch-all-financial-years`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.essage || error?.message,
      };
    }
  },
);

/* api for getting monthly complaint count by financial year */
export const getMonthlyComplaintCountByFY = createAsyncThunk(
  'getMonthlyComplaintCountByFY ',
  async financial_year => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/dashboard/get-monthly-complaints?year_name=${
          financial_year || ''
        }`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.essage || error?.message,
      };
    }
  },
);
export const getInvoiceByFY = createAsyncThunk(
  'getInvoiceByFY',
  async financial_year => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/dashboard/get-monthly-invoice-amount?financial_year=${
          financial_year || ''
        }&ro=`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.essage || error?.message,
      };
    }
  },
);

/* api for getting payment by financial year */
export const getPaymentByFY = createAsyncThunk(
  'getPaymentByFY',
  async financial_year => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/dashboard/get-all-payment-recieve-in-dashboard?financial_year=${
          financial_year || ''
        }&ro=`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.essage || error?.message,
      };
    }
  },
);

/* api for getting measurement by financial year */
export const getMeasurementByFY = createAsyncThunk(
  'getMeasurementByFY',
  async financial_year => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/dashboard/get-monthly-measurement-amount?financial_year=${
          financial_year || ''
        }&ro=`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.essage || error?.message,
      };
    }
  },
);

/* api for getting performa invoice by financial year */
export const getPerformaInvoiceByFY = createAsyncThunk(
  'getPerformaInvoiceByFY',
  async financial_year => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/dashboard/get-monthly-proforma-invoice-amount?financial_year=${
          financial_year || ''
        }&ro=`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.essage || error?.message,
      };
    }
  },
);

/* api for getting performa invoice by financial year */
export const getAreaManagerComplaints = createAsyncThunk(
  'getAreaManagerComplaints',
  async selectedFY => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/dashboard/get-area-managers?year_name=${
          selectedFY || ''
        }`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.essage || error?.message,
      };
    }
  },
);

/* api for getting performa invoice by financial year */
export const getEndUserComplaints = createAsyncThunk(
  'getEndUserComplaints',
  async selectedFY => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/dashboard/get-end-users-dashboard?year_name=${
          selectedFY || ''
        }`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.essage || error?.message,
      };
    }
  },
);

/* api for getting performa invoice by financial year */
export const getAreaManagerBillingDetails = createAsyncThunk(
  'getAreaManagerBillingDetails',
  async selectedFY => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/dashboard/get-area-manager-billing-dashboard?financial_year=${
          selectedFY || ''
        }`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.essage || error?.message,
      };
    }
  },
);

/* api for getting performa invoice by financial year */
export const getRoBillingDetails = createAsyncThunk(
  'getRoBillingDetails',
  async selectedFY => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/dashboard/get-ro-billing-dashboard?financial_year=${
          selectedFY || ''
        }`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.essage || error?.message,
      };
    }
  },
);

/* api for getting all complaint data by financial year */
export const getAllComplaintDataByFY = createAsyncThunk(
  'getAllComplaintDataByFY ',
  async ({financial_year = '', status = ''}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/dashboard/get-total-complaints?year_name=${financial_year}&status=${status}`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.essage || error?.message,
      };
    }
  },
);

/* api for getting all complaint data by for Excel */
export const getAllComplaintData = createAsyncThunk(
  'getAllComplaintData',
  async ({financial_year = '', status = ''}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/complaints/get-all-complaints?year_name=${financial_year}&status=${status}`,
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

/* api for getting all complaint data by for Excel */
export const getAllFromCompany = createAsyncThunk(
  'getAllComplaintData',
  async () => {
    try {
      const {data} = await customApi.get(`/api/super-admin/get-from-companies`);
      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);
