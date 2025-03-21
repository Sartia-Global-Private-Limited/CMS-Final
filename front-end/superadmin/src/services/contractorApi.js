import { customApi } from "./authapi";
import { QUERY_PARAMS } from "../utils/helper";

customApi.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("cms-sa-token");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// API for DASHBOARD
export const getAllComplaintsDetails = async (year_name, pageSize) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/dashboard/get-total-complaints?year_name=${
        year_name || ""
      }&&pageSize=${pageSize || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.message || error.message,
    };
  }
};

export const getAllMeasurementDetails = async (year_name) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/dashboard/get-monthly-measurement-amount?financial_year=${
        year_name || ""
      }&ro=`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.message || error.message,
    };
  }
};

export const getAllProformaInvoiceforDashboard = async (year_name) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/dashboard/get-monthly-proforma-invoice-amount?financial_year=${
        year_name || ""
      }&ro=`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.message || error.message,
    };
  }
};

export const getAllInvoiceforDashboard = async (year_name) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/dashboard/get-monthly-invoice-amount?financial_year=${
        year_name || ""
      }&ro=`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.message || error.message,
    };
  }
};

export const getAllPaymentforDashboard = async (year_name) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/dashboard/get-all-payment-recieve-in-dashboard?financial_year=${
        year_name || ""
      }&ro=`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.message || error.message,
    };
  }
};

export const getApiForComplaintsDetails = async (year_name) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/dashboard/get-monthly-complaints?year_name=${
        year_name || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getDetailsOfAreaManagerDetails = async (year_name) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/dashboard/get-area-managers?year_name=${
        year_name || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getDetailsOfEndUserDetails = async (year_name) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/dashboard/get-end-users-dashboard?year_name=${
        year_name || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getDetailsOfAreaManagerBillingDetails = async (year_name) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/dashboard/get-area-manager-billing-dashboard?financial_year=${
        year_name || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getBillingDetailsOfRegionalOffice = async (year_name) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/dashboard/get-ro-billing-dashboard?financial_year=${
        year_name || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

//  PREVIOUS DASHBOARD API

export const getcontractorSidebar = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/plan/get-all-sidebar-modules`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

//  PREVIOUS DASHBOARD API
export const getAllFinancialYearsForDashboard = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/fetch-all-financial-years`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getDetailsOfComplaintInAreaManager = async (
  values,
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/dashboard/get-all-complaints-by-status?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllComplaints = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-all-complaints?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// API"S for OIL AND GAS COMPANY TEAM
export const postEnergyCompany = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/oil-and-gas/create-energy-company-user`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAreaManagerInEnergyCompanyById = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);

    const { data } = await customApi.get(
      `/api/super-admin/oil-and-gas/get-energy-company-users?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getallAreaManagerInEnergyCompany = async (
  areaId,
  energy_company_id
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-area-data-for-energy/${energy_company_id}/${areaId}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateEnergyCompany = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/oil-and-gas/update-energy-company-user`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteEnergyCompanyById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/oil-and-gas/delete-energy-company-user/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

//  FUEL STATION
export const postOutlet = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/fuel-station/add-outlet`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllOutletById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/fuel-station/get-outlet/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateOutlet = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/fuel-station/update-outlet`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteOutletById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/fuel-station/delete-outlet/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const approveRejectOutletById = async (status, outletId) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/fuel-station/approve-reject-outlet-by-id?id=${
        outletId || ""
      }&&status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

//  State Api's
export const getAllState = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-state-details`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Bank Data Api's
export const getAllBankData = async () => {
  try {
    const { data } = await customApi.get(`/api/super-admin/get-all-bank-list`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S For CONTACT MODULE
export const postContacts = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/contacts/store-company-contact-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllContacts = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/contacts/get-all-stored-company-contact-details?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleContactsById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/contacts/get-stored-company-contact-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateContacts = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/contacts/update-stored-company-contact-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteContactsById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/contacts/delete-company-contact-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAreaManagerInEnergyCompanyByIdInContact = async (
  energyId,
  areaId,
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/contacts/get-energy-company-users?id=${
        energyId || ""
      }&&user_id=${areaId || ""}&&search=${search || ""}&&pageSize=${
        pageSize || ""
      }&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllOutletInContact = async (
  search,
  pageSize,
  pageNo,
  status
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/contacts/all-outlets?search=${search || ""}&&status=${
        status || ""
      }&&pageNo=${pageNo || ""}&&pageSize=${pageSize || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllClientContacts = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/contacts/get-client-users?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllSupplierContacts = async (
  search,
  pageSize,
  pageNo,
  isDropdown,
  status
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/contacts/get-suppliers?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&isDropdown=${
        isDropdown || ""
      }&&status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S For COMPLAINT MODULE
export const getRequestComplaints = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-requested-complaints?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllApprovedUnAssignComplaints = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-all-approved-un-assign-complaints?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllApprovedAssignComplaints = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-all-approved-assign-complaints?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getApprovedComplaints = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-approved-complaints?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getRejectedComplaints = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-rejected-complaints?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getResolvedComplaints = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-all-resolved-complaints?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getComplaintsDetailsById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-complaints-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getManagerListWithTotalFreeUser = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-all-manager-list-with-total-free-end-users?complaintId=${
        id || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getSupervisorListWithTotalFreeUserByManagerId = async (
  id,
  params
) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-all-supervisor-by-manager-with-count-free-end-users/${id}?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllEndUserBySupervisorId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-all-end-users-by-supervisor/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAreaManagerAssign = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-area-manager-assign?status=${
        status || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSupervisorAssign = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-supervisor-assign?id=${id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllEndUser = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-end-user-assign?id=${id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getApprovedComplaintsDetailsById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-approved-complaints-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getTotalMemberOnSingleComplaintById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-total-member-on-single-complaint/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getComplaintsTimelineById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-complaints-timeline/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const postRejectComplaints = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/complaints/update-complaint-status`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postRejectApprovedComplaints = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/complaints/rejected-assign-complaint-users`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postAfterAssignCanRejectedComplaints = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/complaints/rejected-assign-complaint-users`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postReactiveRejectComplaints = async (id) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/complaints/reactive-complaints-status-update/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postApprovedComplaints = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/complaints/approved-complaints`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postAssignComplaintToUser = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/complaints/assign-complaint-to-user`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postHoldComplaintToUser = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/complaints/hold-and-transfer-complaints`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateAssignComplaintToUser = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/complaints/update-assign-complaint-to-user`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postChangeStatusComplaints = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/complaints/update-allocate-complaints`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postReactiveResolveComplaints = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/complaints/re-work-for-resolved-complaints`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S FOR EARTHING TESTING MODULE
export const postEarthingTesting = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/earthing-testing/add-earthing-testing-report`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllEarthingTesting = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/earthing-testing/get-earthing-testing-lists?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getSingleEarthingTestingById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/earthing-testing/get-earthing-testing-detail/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateEarthingTesting = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/earthing-testing/update-earthing-testing-detail`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const approveRejectEarthingTestingById = async (
  status,
  earthingTestingId
) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/earthing-testing/approve-reject-earthing-testing-by-status?id=${
        earthingTestingId || ""
      }&&status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S FOR BILLING MODULE
// MEASUREMENT
export const getAllSalesAreaNameForMeasurement = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/get-all-sale-in-ptm?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const updateHardCopiesInMeasurements = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-pi-attachment-complaint`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllOutletNameForPTM = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/get-all-outlets-in-ptm?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllRegionalNameForPTM = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/get-all-regionals-in-ptm?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllOrderByForPTM = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/get-all-order-by-in-ptm?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllCompanyForPTM = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/get-all-companies-in-ptm?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllComplaintInMeasurement = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-complaint-types?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllComplaintTypeForPTM = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-complaint-types?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllPoNumberForBilling = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/get-all-po-in-billing?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const postHardCopiesInMeasurements = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/measurement/files-upload-in-billing`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postMeasurements = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/measurement/create-measurement`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllmeasurementByStatus = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/billing/measurement/get-all-measurements-based-on-status?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllSalesAreaNameForBilling = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/measurement/get-all-sales-in-billing?status=${
        status || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllOutletNameForBilling = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/measurement/get-all-outlet-in-billing?status=${
        status || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllRegionalNameForBilling = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/measurement/get-all-regional-in-billing?status=${
        status || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllOrderByForBilling = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/billing/measurement/get-all-order-by-for-measurements?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllCompanyForBilling = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/measurement/get-all-companies-in-billing?status=${
        status || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getDetailsOfProcessToMeasurement = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/measurement/get-measurements-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getSingleMeasurementsById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/measurement/get-measurements-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const downloadMeasurementBill = async (id, pdf) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/measurement/get-measurements-details/${id}?pdf=${
        pdf || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getDetailsofComplaintsInMeasurement = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/measurement/get-pi-attachment-by-complaint-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getApiToForStockAndFundDetails = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/measurement/get-all-approved-data/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllPoDetails = async () => {
  try {
    const { data } = await customApi.get(`/api/super-admin/get-all-po-details`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllItemsOnPoNumber = async (po_id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-purchase-order-details-with-items/${po_id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllItemsByPoId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-purchase-order-details-with-items/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getMeasurementTimeHistory = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/measurement/get-measurements-timeline-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const discardMeasurementsById = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/measurement/discard-measurement-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllPoBasedOnRo = async (po, ro) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/measurement/get-po-exists-or-not?po=${
        po || ""
      }&&ro=${ro || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const changePoNumber = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/measurement/change-po-details-by-same-po`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// PERFORMA INVOICE
export const getAllSalesAreaforfilter = async (status, po_id, ro_id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-sa-filters?status=${status || ""}&&po_id=${
        po_id || ""
      }&&ro_id=${ro_id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getComplainDetailsForMeasurement = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-complaints-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllReadyToPi = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/billing/performa-invoice/get-measurements-in-pi-status?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllPerformaInvoice = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/billing/performa-invoice/get-all-proforma-invoices?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// MERGED_PERFORMA_INVOICE

export const getComplaintsListingToMerge = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/billing/merged-performa/get-all-pi-merged-performa?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllMergedToPiListing = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/billing/merged-performa/get-all-merged-proforma-invoice?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// INVOICE

export const getAllInvoiceListing = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);

    const { data } = await customApi.get(
      `/api/super-admin/billing/invoice/get-all-listing-pi-and-mpi?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllFinalInvoicesListing = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);

    const { data } = await customApi.get(
      `/api/super-admin/billing/invoice/get-all-invoice-data?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// MERGED_INVOICE

export const getAllMergeInvoice = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/billing/merged-invoice/get-all-merged-invoice?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// PAYMENTS

export const getAllFinalInvoices = async (pageSize, pageNo, search) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/payments/get-all-invoice-in-payments?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// PAYMENTS_RECEIVED

export const getAllPVNumber = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/payment-received/listing-pv-number?status=${
        status || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// RETENTION_MONEY

export const getAllPaymentDoneListingInRetention = async (
  pageSize,
  pageNo,
  search,
  pv_number
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/retention/get-payment-received-in-retention-by-status?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&pv_number=${
        pv_number || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllEligibleAndDoneRetentions = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);

    const { data } = await customApi.get(
      `/api/super-admin/billing/retention/get-all-payment-retention?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const reactiveMeasurementsById = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/reactive-to-discard-measurements`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllComplaintTypeForBilling = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/measurement/get-all-complaint-types-in-billing?status=${
        status || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllOutletforfilter = async (
  status,
  po_id,
  ro_id,
  sale_area_id
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-outlet-filters?status=${status || ""}&&po_id=${
        po_id || ""
      }&&ro_id=${ro_id || ""}&&sale_area_id=${sale_area_id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllComplaintTypeforfilter = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);

    const { data } = await customApi.get(
      `/api/super-admin/get-all-complaint-types-filters?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllAreaManagerforfilter = async (
  status,
  po_id,
  ro_id,
  sale_area_id,
  outlet_id,
  company_id,
  complaint_for
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-area-manager?status=${status || ""}&&po_id=${
        po_id || ""
      }&&ro_id=${ro_id || ""}&&sale_area_id=${sale_area_id || ""}&&outlet_id=${
        outlet_id || ""
      }&&company_id=${company_id || ""}&&complaint_for=${complaint_for || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllPoList = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-po-filters?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllRoList = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-ro-filters?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllCompanyNAme = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-complaints-in-pi?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllPoListInvoice = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-po-from-proforma?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllRoListInvoice = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-ro-from-proforma?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllBillNumber = async (
  status,
  ro_id,
  po_id,
  invoice,
  sale_area_id
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-bill-from-proforma?status=${
        status || ""
      }&&ro_id=${ro_id || ""}&&po_id=${po_id || ""}&&invoice=${
        invoice || ""
      }&&sale_area_id=${sale_area_id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const discardPerformaById = async (id) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/discard-proforma-invoice/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllSaListInvoice = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);

    const { data } = await customApi.get(
      `/api/super-admin/get-all-sales-area-from-proforma?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllOutletForPerforma = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-outlet-from-proforma?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllComplaintTypeListInvoice = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);

    const { data } = await customApi.get(
      `/api/super-admin/get-all-complaint-types-from-proforma?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllFinacialYear = async (
  status,
  ro_id,
  po_id,
  sale_area_id,
  bill_number
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-financial-year-from-proforma?status=${
        status || ""
      }&&ro_id=${ro_id || ""}&&po_id=${po_id || ""}&&sale_area_id=${
        sale_area_id || ""
      }&&bill_number=${bill_number || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getDetailPerforma = async (id, pdf) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/performa-invoice/get-single-proforma-invoice/${id}?pdf=${
        pdf || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getDetailsOfFinalMergeToPI = async (id, pdf) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/merged-performa/get-merged-proforma-invoice/${id}?pdf=${
        pdf || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllDiscardMeasurementDetails = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-discard-measurements-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const updateMeasurements = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/measurement/update-measurement-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllComapnyDataForBillingFrom = async (isDropdown) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-my-company-list?isDropdown=${isDropdown || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllItemsOnMeasurementId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-items-on-measurement-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const fetchMeasurementDatabyPoAndMeasurementId = async (
  po_id,
  measurement_ids
) => {
  const values = { po_id, measurement_ids };

  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-measurements-detail-po?po_id=${
        po_id || ""
      }&&measurement_ids=${measurement_ids || ""}`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateProformaInvoice = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/performa-invoice/update-proforma-invoice-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postProformaInvoice = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/performa-invoice/generate-proforma-invoice`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const discardfinalInvoices = async (id) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/discard-invoice/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getInvoiceDetails = async (id, pdf) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/invoice/get-single-invoice-details/${id}?pdf=${
        pdf || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllFinancialYearListInvoice = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-financial-year-from-proforma?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllBillingFrom = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/ro-to-billing-from-company?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
export const getAllBillingTo = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/from-billing-to-company?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const fetchPerformaListing = async (measurement_ids) => {
  const value = { id: measurement_ids };
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/invoice/get-all-pi-listing`,
      value
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const updateInvoice = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/invoice/update-invoice-data`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postInvoice = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/invoice/create-invoice-data`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllMeasurements = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-measurements?search=${search || ""}&&pageSize=${
        pageSize || ""
      }&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const deleteMeasurementsById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/delete-measurements-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllPoListInMergeInvoice = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-po-for-invoices?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllRoListInMergeInvoice = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-ro-for-invoice?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllSalesAreaInInvoice = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-sales-area-for-invoice?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllComplaintTypeListInInvoice = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);

    const { data } = await customApi.get(
      `/api/super-admin/get-all-complaint-types-for-invoice?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllBillingFromList = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-billing_from-company-invoice?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllBillingToListing = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-billing-to-company-invoice?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postMergeInvoice = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/merged-invoice/merge-invoice`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const discardFinalMergedInvoices = async (id) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/discard-merged-invoice/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getDetailsOfMergedInvoice = async (id, pdf) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/merged-invoice/get-merged-invoice-by-id/${id}?pdf=${
        pdf || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const discardfinalMergedPI = async (value) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/discard-merged-pi`,
      value
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postMergePi = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/merged-performa/merged-proforma-invoice`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getInvoicesDetails = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-payment-received-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllInvoicesData = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-invoice-data-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const updatePaymentRecieved = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/payment-received/update-payment-received-by-id`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postPaymentRecieved = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/payments/add-payment-to-invoice`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getPayementRecievedDetails = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-payment-received-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getPaymentVoucher = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-payment-history?id=${id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllProcessPaymentPaid = async (
  status,
  pageSize,
  pageNo,
  search
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-payment-paid?status=${status || ""}&&search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllRoListing = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-ro-for-dropdown?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllRetentionIdListing = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-retention-id-for-dropdown?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const ApproveOrReeligibleRetentions = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-payment-retention-status`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllPONumber = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-po-for-payment-retention?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getPaymentPaidDetails = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-payment-paid-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const otpVerifyInPaymentPaid = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/otp-verify-in-payment-paid`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllPaidPaymentListing = async (
  pageSize,
  pageNo,
  search,
  ro_id,
  area_manager_id
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-complaints-via-invoice?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&ro=${
        ro_id || ""
      }&&manager_id=${area_manager_id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllRoInPaymentPaid = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-ro-in-paid-payment`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllAreaManagerInPaymentPaid = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-area-manager-in-paid-payment`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postPaymentPaid = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payment-paid`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const resendOTPInPaymentPaid = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/resend-otp-in-payment-paid`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getPODetailsById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-po-details-in-ro-payments-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const deleteProformaInvoiceById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/delete-proforma-invoice/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postPiToMerge = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/merge-pi-to-invoice`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllSalesAreaListing = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);

    const { data } = await customApi.get(
      `/api/super-admin/get-sales-area-for-dropdown?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllOutletListing = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);

    const { data } = await customApi.get(
      `/api/super-admin/get-outlet-for-dropdown?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllComplaintTypeListing = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);

    const { data } = await customApi.get(
      `/api/super-admin/get-complaint-type-for-dropdown?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllBillingFromListing = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);

    const { data } = await customApi.get(
      `/api/super-admin/get-billing-from-for-dropdown?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllBillingToListingforFilter = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);

    const { data } = await customApi.get(
      `/api/super-admin/get-billing-to-for-dropdown?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const approveEligibleRetention = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/retention/approve-payment-retention`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const approveRetentionAmount = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/retention/update-payment-amount-retention`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getInvoiceDetailForRetention = async (id, pdf) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/retention/get-payment-retention-by-id/${id}?pdf=${
        pdf || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postRetentionMoney = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/retention/update-payment-retention`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const discardRetentions = async (id) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/billing/retention/discard-payment-retention/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllPaymentRecievedListing = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/billing/payment-received/get-payment-received-by-status?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// All Suppliers Api's
export const getAllSuppliers = async ({
  search,
  pageSize,
  pageNo,
  isDropdown,
  status,
}) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/suppliers/get-suppliers?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&isDropdown=${
        isDropdown || ""
      }&&status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllUnitMasterForDropdown = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-unit-data-list`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Earthing Testing Api

export const postEarthingTestingEarthPitReport = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/earth-pit-reports`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const changeStatusEarthingTesting = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/change-earthing-testing-status`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllOutletList = async () => {
  try {
    const { data } = await customApi.get(`/api/super-admin/get-outlet-list`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllComplaintList = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-complaint-list`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// only complaints
export const getAllRegionalOrderBy = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-regional-order-by`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllManagersUser = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-managers-users`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllOfficeUser = async () => {
  try {
    const { data } = await customApi.get(`/api/super-admin/get-all-users`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllSupervisors = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-supervisors`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllComplaintsForMeasurement = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/billing/get-resolved-complaint-in-billing?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// Outlet Api's
// export const getAllOutlet = async (search, pageSize, pageNo, status) => {
//   try {
//     const { data } = await customApi.get(
//       `/api/super-admin/outlets/all-outlets?search=${search || ""}&&status=${
//         status || ""
//       }&&pageNo=${pageNo || ""}&&pageSize=${pageSize || ""}`
//     );
//     return data;
//   } catch (error) {
//     return {
//       status: false,
//       message: error.response?.data.message || error.message,
//     };
//   }
// };

export const getAllOutlet = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);

    const { data } = await customApi.get(
      `/api/super-admin/outlets/all-outlets?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// Contacts
export const getAllComapnyData = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-company-details`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllMyCompanyList = async (isDropdown) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/company/my-company/get-my-company-list?isDropdown=${
        isDropdown || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllStoredContactsPositions = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-stored-company-contact-positions`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSendMessagesById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-message-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.message || error?.message,
    };
  }
};

export const updateMessages = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-message`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// send message
export const postMessages = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/contacts/send-message`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S FOR MASTER DATA MODULE

// BANK
export const getAllBankList = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/bank/get-bank-list?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postBankList = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/bank/add-bank-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleBankListById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/bank/get-bank-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateBankList = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/bank/update-bank-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

//  ACCOUNTS
export const postAccountDetails = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/accounts/add-bank-account-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllAccountDetails = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/accounts/get-all-account-details?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleAccountDetailsById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/accounts/account-details-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAccountTransactionHistory = async (
  id,
  filterBy,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/accounts/get-account-transaction-history/${id}?date=${filterBy}&&pageSize=${
        pageSize || ""
      }&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateAccountDetails = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/accounts/update-account-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteAccountDetailsById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/master-data/accounts/delete-account-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// FINANCIAL YEAR
export const postFinancialYears = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/financial-year/create-financial-year`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleFinancialYearsById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/financial-year/fetch-financial-year-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateFinancialYears = async (id, values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/master-data/financial-year/update-financial-year-by-id/${id}`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteFinancialYearsById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/master-data/financial-year/delete-financial-year-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// TAX
export const getAllTaxManagement = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/tax/get-all-saved-gst-masters?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postTaxManagement = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/tax/save-gst-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateTaxManagement = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/tax/update-gst-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteTaxManagementById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/master-data/tax/delete-gst-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleTaxManagementById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/tax/get-saved-gst-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// BILL NO. FORMAT
export const postBillNoFormat = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/bill-format/generate-invoice-number-format`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllBillNoFormat = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/bill-format/get-all-generate-invoice-formats?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateBillNoFormat = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/bill-format/update-invoice-number-format`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleBillNoFormatById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/bill-format/get-invoice-number-format-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteBillNoFormatById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/master-data/bill-format/delete-invoice-number-format-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateBillFormateStatus = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/master-data/bill-format/update-invoice-number-format-status`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Employee NO. FORMAT
export const postEmployeeNoFormat = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/employee-format/generate-employee-number-format`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllEmployeeNoFormat = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/employee-format/get-all-employee-number-formats?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateEmployeeNoFormat = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/employee-format/update-employee-number-format`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleEmployeeNoFormatById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/employee-format/get-employee-number-format-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteEmployeeNoFormatById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/master-data/employee-format/delete-employee-number-format-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateEmployeeFormateStatus = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/master-data/employee-format/update-employee-number-format-status`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Client NO. FORMAT
export const postClientNoFormat = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/client-vendor-format/generate-client-vendor-number-format`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllClientNoFormat = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/client-vendor-format/get-all-client-vendor-number-formats?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateClientNoFormat = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/client-vendor-format/update-client-vendor-number-format`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleClientNoFormatById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/client-vendor-format/get-client-vendor-number-format-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteClientNoFormatById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/master-data/client-vendor-format/delete-client-vendor-number-format-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateClientFormateStatus = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/master-data/client-vendor-format/update-client-vendor-number-format-status`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Item NO. FORMAT
export const postItemNoFormat = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/item-format/generate-item-number-format`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllItemNoFormat = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/item-format/get-all-item-number-formats?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateItemNoFormat = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/item-format/update-item-number-format`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleItemNoFormatById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/item-format/get-item-number-format-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteItemNoFormatById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/master-data/item-format/delete-item-number-format-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateItemFormateStatus = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/master-data/item-format/update-item-number-format-status`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// PAYMENT METHODS
export const postPaymentMethod = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/payment-method/add-payment-method`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updatePaymentMethod = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/payment-method/update-payment-method`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deletePaymentMethodById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/master-data/payment-method/delete-payment-methods/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSinglePaymentMethodById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/payment-method/get-single-payment-method-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// ADD BALANCE
export const addWalletBalance = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/add-balance/add-wallet-amount`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// MasterDataManagement
export const getAllBankListForDropdown = async () => {
  try {
    const { data } = await customApi.get(`/api/super-admin/get-all-bank-list`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllAccountByBankId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-bank-to-account/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postImportBankList = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/import-bank-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllFinancialYears = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/billing/fetch-all-financial-years?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllPaymentMethod = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/payment-method/get-all-payment-methods?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// ItemMaster Data
export const getAllBrand = async ({ search, pageSize, pageNo, isDropdown }) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/item-master/get-all-brand?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&isDropdown=${
        isDropdown || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleBrandById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/item-master/get-brand-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postBrand = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/item-master/create-brand`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateBrand = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/item-master/update-brand`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteBrandById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/item-master/delete-brand/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllSubCategory = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-sub-category?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getSingleSubCategoryById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/item-master/get-sub-category-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const updateSubCategory = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/item-master/edit-sub-category`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const createSubCategory = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/item-master/add-sub-category`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const deleteSubCategoryById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/item-master/delete-sub-category/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllBrandName = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-brand-markdown`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// API'S FOR PURCHASE AND SALES MODULE

// PURCHASE ORDER
export const postPurchaseOrder = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/purchase-sale/purchase/create-po-order`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllPurchaseOrder = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/purchase-sale/purchase/get-all-generated-po?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllRoInSecurityEligible = async (status, po_id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/purchase-sale/get-ro-for-po?status=${
        status || ""
      }&&po_id=${po_id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllPoInSecurityEligible = async (status, ro_id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/purchase-sale/get-po-number-for-po?status=${
        status || ""
      }&&ro=${ro_id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const approveEligibleSecurity = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/purchase-sale/approve-purchase-order`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const PostApproveSecurityRefund = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/purchase-sale/purchase/approve-update-purchase-order`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllSecurityIdListing = async (status, poId) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/purchase-sale/get-security-unique-id?status=${
        status || ""
      }&&po=${poId || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSinglePurchaseOrderById = async (
  id,
  pageSize,
  pageNo,
  search
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/purchase-sale/purchase/get-single-po-details/${id}?pageSize=${
        pageSize || ""
      }&&pageNo=${pageNo || ""}&&search=${search || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllFromCompanies = async () => {
  try {
    const { data } = await customApi.get(`/api/super-admin/get-from-companies`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updatePurchaseOrder = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/purchase-sale/purchase/update-po-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deletePurchaseOrderById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/purchase-sale/purchase/delete-po-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getCheckPoIsExists = async (search) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/purchase-sale/check-po-is-exists?search_value=${search}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getPoOnRoId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/purchase-sale/get-po-details-on-ro/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postTaxCalculationType = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/purchase-sale/get-tax-calculation-type`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllGstTypes = async () => {
  try {
    const { data } = await customApi.get(`/api/super-admin/get-all-gst-type`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const postChangePoStatus = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/purchase-sale/purchase/change-po-status`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// SALES ORDER
export const postSalesOrder = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/purchase-sale/sales/create-so-order`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateSalesOrder = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/purchase-sale/sales/update-so-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllSalesOrder = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/purchase-sale/sales/get-all-generated-so?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleSalesOrderById = async (id, params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/purchase-sale/sales/get-single-so-details/${id}?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteSalesOrderById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/purchase-sale/sales/delete-so-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getCheckSoIsExists = async (search) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/purchase-sale/check-so-is-exists?search_value=${search}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postChangeSoStatus = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/purchase-sale/sales/change-so-status`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const approveEligibleSecurityInSo = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/purchase-sale/approve-sales-order`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const PostApproveSecurityRefundInSo = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/purchase-sale/approve-update-sales-order`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllSecurityIdListingInSo = async (status, soId) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/purchase-sale/get-sales-security-unique-id?status=${
        status || ""
      }&&so=${soId || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllRoForSoInSecurityEligible = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/purchase-sale/get-ro-for-so?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllSoInSecurityEligible = async (status, ro_id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/purchase-sale/get-so-number-for-so?status=${
        status || ""
      }&&ro=${ro_id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S FOR WORK QUOTATION MODULE
export const postQuotation = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/quotations/create-quotation`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getWorkQuotation = async (search, pageSize, pageNo, status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/quotations/get-quotation?status=${
        status || ""
      }&&search=${search || ""}&&pageSize=${pageSize || ""}&&pageNo=${
        pageNo || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getQuotationById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/quotations/get-quotation-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateQuotation = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/quotations/update-quotation/${values.id}`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteQuotationById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/quotations/delete-quotation/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const approveRejectQuotationById = async (status, quotationId) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/quotations/approve-rejected-quotation-by-id?status=${
        status || ""
      }&&id=${quotationId || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getFromCompanyList = async (isDropdown) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/all-sale-companies?isDropdown=${isDropdown || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getToCompanyList = async (isDropdown) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-my-company-list?isDropdown=${isDropdown || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getEnergyCompanydata = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-active-energy-companies`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// REGIONAL OFFICE
export const getAllRegionalOffice = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-regional-office-details?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllROData = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-regional-office-details`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Complaint Type Api's
export const getAllComplaintType = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-complaint-types`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Outlet On SaleArea Id Api's
export const getOutletOnSaId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-outlet-by-sale-area/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSendByEmailQuotation = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/quotation-send-by-email`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Quotation Api's
export const getAllQuotation = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/quotations/get-quotation?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// API'S FOR IMPORT MODULE **************

// upload company using csv file
export const uploadCompany = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/company/import-companies`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// upload complaint using csv file
export const uploadComplaint = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/complaints/import-complaint`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// upload outlet using csv file
export const uploadOutlets = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/fuel-station/import-outlet`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// FEEDBACK AND SUGGESTIONS

export const postFeedbackSuggestion = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/feedback-suggestion/create-feedback-and-complaint`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllFeedbackSuggestion = async (
  search,
  pageSize,
  pageNo,
  feedbackSuggestionId
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/feedback-suggestion/get-all-feedback-and-complaint?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&status=${
        feedbackSuggestionId || ""
      }`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getFeedbackSuggestionById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/feedback-suggestion/get-feedback-and-complaint/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteFeedbackSuggestionById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/feedback-suggestion/delete-feedback-and-complaint/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const postResponse = async (id, values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/feedback-suggestion/add-response/${id}`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
