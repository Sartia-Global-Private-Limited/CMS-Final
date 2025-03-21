import { QUERY_PARAMS } from "../utils/helper";
import { customApi } from "./authapi";

customApi.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("cms-ca-token");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// API for DASHBOARD
export const getAllComplaintsDetails = async (year_name, pageSize) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/dashboard/get-total-complaints?year_name=${
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
      `/api/contractor/dashboard/get-monthly-measurement-amount?financial_year=${
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
      `/api/contractor/dashboard/get-monthly-proforma-invoice-amount?financial_year=${
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
      `/api/contractor/dashboard/get-monthly-invoice-amount?financial_year=${
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
      `/api/contractor/dashboard/get-all-payment-recieve-in-dashboard?financial_year=${
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
      `/api/contractor/dashboard/get-monthly-complaints?year_name=${
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
      `/api/contractor/dashboard/get-area-managers?year_name=${year_name || ""}`
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
      `/api/contractor/dashboard/get-end-users-dashboard?year_name=${
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
      `/api/contractor/dashboard/get-area-manager-billing-dashboard?financial_year=${
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
      `/api/contractor/dashboard/get-ro-billing-dashboard?financial_year=${
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
export const getAllFinancialYearsForDashboard = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/fetch-all-financial-years`
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
      `/api/contractor/dashboard/get-all-complaints-by-status?search=${
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
      `/api/contractor/complaints/get-all-complaints?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const getAllPaymentRecievedListing = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/billing/payment-received/get-payment-received-by-status?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API"S for OIL AND GAS COMPANY TEAM

export const postEnergyCompany = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/oil-and-gas/create-energy-company-user`,
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

export const getAreaManagerInEnergyCompanyById = async (
  energyId,
  areaId,
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/oil-and-gas/get-energy-company-users?id=${
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

export const updateEnergyCompany = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/oil-and-gas/update-energy-company-user`,
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
      `/api/contractor/oil-and-gas/delete-energy-company-user/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// area manager

export const getallAreaManagerInEnergyCompany = async (
  areaId,
  energy_company_id
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-area-data-for-energy/${energy_company_id}/${areaId}`
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

//API'S FOR OUTLET BY FUEL STATION
export const getAllZoneByOutlet = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/outlets/get-all-zone-for-outlets?id=${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllRegionalByOutlet = async (id, zone_id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/outlets/get-all-regional-office-for-outlets?id=${id}&zone_id=${zone_id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllSalesAreaByOutlet = async (
  id,
  zone_id,
  regional_office_id
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/outlets/get-all-sales-area-for-outlets?id=${id}&zone_id=${zone_id}&regional_office_id=${regional_office_id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllDistrictByOutlet = async (
  id,
  zone_id,
  regional_office_id,
  sales_area_id
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/outlets/get-all-district-for-outlets?id=${id}&zone_id=${zone_id}&regional_office_id=${regional_office_id}&sales_area_id=${sales_area_id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const postOutlet = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/fuel-station/add-outlet`,
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

export const getAllOutlet = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/fuel-station/all-outlets?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllOutletById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/fuel-station/get-outlet/${id}`
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
      `/api/contractor/fuel-station/update-outlet`,
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
      `/api/contractor/fuel-station/delete-outlet/${id}`
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
      `/api/contractor/fuel-station/approve-reject-outlet-by-id?id=${
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

// API FOR SUPPLIER MODULE

export const postSuppliers = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/suppliers/create-suppliers`,
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

export const getAllSuppliers = async ({
  search,
  pageSize,
  pageNo,
  isDropdown,
  status,
  isTransactions,
}) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/suppliers/get-suppliers?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&isDropdown=${
        isDropdown || ""
      }&&status=${status || ""}&&isTransactions=${isTransactions || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getSingleSuppliersById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/suppliers/get-suppliers-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateSuppliers = async (id, values) => {
  try {
    const { data } = await customApi.put(
      `/api/contractor/suppliers/update-suppliers/${id}`,
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

export const importSuppliers = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/suppliers/import-suppliers`,
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

export const deleteSuppliersById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/suppliers/delete-suppliers/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const approveRejectSupplierById = async (status, supplierId) => {
  try {
    const { data } = await customApi.put(
      `/api/contractor/suppliers/approve-reject-suppliers-by-id?status=${
        status || ""
      }&&id=${supplierId || ""}`
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
      `/api/contractor/get-all-state-details`
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
    const { data } = await customApi.get(`/api/contractor/get-all-bank-list`);
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
      `/api/contractor/contacts/store-company-contact-details`,
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

export const getAllContacts = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/contacts/get-all-stored-company-contact-details?search=${
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

export const getSingleContactsById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/contacts/get-stored-company-contact-details/${id}`
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
      `/api/contractor/contacts/update-stored-company-contact-details`,
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
      `/api/contractor/contacts/delete-company-contact-details/${id}`
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
      `/api/contractor/contacts/get-energy-company-users?id=${
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
      `/api/contractor/contacts/all-outlets?search=${search || ""}&&status=${
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
      `/api/contractor/contacts/get-client-users?${queryParams}`
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
      `/api/contractor/contacts/get-suppliers?search=${
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

// designation
export const getAllStoredContactsPositions = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-stored-company-contact-positions`
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
      `/api/contractor/contacts/send-message`,
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

// company data
export const getAllComapnyData = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-company-details`
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
      `/api/contractor/complaints/get-requested-complaints?${queryParams}`
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
      `/api/contractor/complaints/get-all-approved-un-assign-complaints?${queryParams}`
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
      `/api/contractor/complaints/get-all-approved-assign-complaints?${queryParams}`
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
      `/api/contractor/complaints/get-approved-complaints?${queryParams}`
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
      `/api/contractor/complaints/get-rejected-complaints?${queryParams}`
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
      `/api/contractor/complaints/get-all-resolved-complaints?${queryParams}`
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
      `/api/contractor/complaints/get-complaints-details/${id}`
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
      `/api/contractor/complaints/get-all-manager-list-with-total-free-end-users?complaintId=${
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
      `/api/contractor/complaints/get-all-supervisor-by-manager-with-count-free-end-users/${id}?${queryParams}`
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
      `/api/contractor/complaints/get-all-end-users-by-supervisor/${id}`
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
      `/api/contractor/complaints/get-area-manager-assign?status=${
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
      `/api/contractor/complaints/get-supervisor-assign?id=${id || ""}`
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
      `/api/contractor/complaints/get-end-user-assign?id=${id || ""}`
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
      `/api/contractor/complaints/get-approved-complaints-details/${id}`
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
      `/api/contractor/complaints/get-total-member-on-single-complaint/${id}`
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
      `/api/contractor/complaints/get-complaints-timeline/${id}`
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
      `/api/contractor/complaints/update-complaint-status`,
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
      `/api/contractor/complaints/rejected-assign-complaint-users`,
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
      `/api/contractor/complaints/rejected-assign-complaint-users`,
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
      `/api/contractor/complaints/reactive-complaints-status-update/${id}`
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
      `/api/contractor/complaints/approved-complaints`,
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
      `/api/contractor/complaints/assign-complaint-to-user`,
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
      `/api/contractor/complaints/hold-and-transfer-complaints`,
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
      `/api/contractor/complaints/update-assign-complaint-to-user`,
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
      `/api/contractor/complaints/update-allocate-complaints`,
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
      `/api/contractor/complaints/re-work-for-resolved-complaints`,
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

// API'S For FUND MANAGEMENT MODULE

// FUND REQUEST

export const postFundRequest = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/fund/fund-request/request-fund`,
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

export const getFundRequest = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/fund/fund-request/get-all-fund-requested?search=${search}&&pageSize=${
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

export const getApprovedFundRequest = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/fund/fund-request/get-all-approved-fund-requested?search=${search}&&pageSize=${
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

export const getRejectedFundRequest = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/fund/fund-request/get-all-rejected-fund-requested?search=${search}&&pageSize=${
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

export const getFundRequestById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/fund/fund-request/get-fund-request-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const updateFundRequest = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/fund/fund-request/update-fund-request-details`,
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

export const postFundRequestStatus = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/fund/fund-request/status-changed-of-request`,
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

export const postRejectFundRequest = async (id, module, values) => {
  try {
    const { data } = await customApi.put(
      `/api/contractor/fund/${module}/reject-fund-request/${id}`,
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

// FUND TRANSFER

export const getAllPendingTransferFundRequest = async (
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/fund/fund-transfer/get-pending-transfer-fund?search=${search}&&pageSize=${
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
export const getTransferFund = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/fund/fund-transfer/get-transfer-fund?search=${search}&&pageSize=${
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
export const getAllTransferFundRequest = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/fund/fund-transfer/get-all-transfer-fund?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

//  BANK DROPDOWN

export const getAllBankListForDropdown = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/get-all-bank-list?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// OFFICE

export const getAllOfficeUser = async () => {
  try {
    const { data } = await customApi.get(`/api/contractor/get-all-users`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// MANAGER

export const getAllManagersUser = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-managers-users`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// BANK ACCOUNT

export const getAllAccountByBankId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-bank-to-account/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S For EXPENSE MANAGEMENT MODULE

export const getAllExpenseRequest = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/expense/expense-request/get-all-expense-request-by-month?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getExpenseRequestDetails = async (id, month) => {
  try {
    const { data } = await customApi.get(
      `api/contractor/expense/expense-request/get-all-expense-request-by-id/${id}?search=${
        month || ""
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

export const postExpensePunch = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/expense/add-expense-punch`,
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

export const getAllExpensePunch = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/expense/expense-punch/get-all-expense-punch-list?search=${
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

export const getPunchRequest = async (searchTerm, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/expense/expense-punch/get-all-expense-punch-list?search=${
        searchTerm || ""
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

export const getApprovedExpensePunch = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/expense/expense-punch/get-list-expense-punch-approve?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllItemMasterForDropdownUsingUserid = async (userid) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/expense/expense-punch/get-user-fund-items-lists/${userid}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getUserWalletDetails = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/expense/expense-punch/get-user-wallet-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getSingleExpensePunchById = async (id, complaint_id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/expense/expense-punch/get-expense-punch-details/${complaint_id}/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postApprovePunch = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/contractor/expense/expense-punch/update-approve-qty`,
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

// REGIONAL OFFICE
export const getAllRegionalOffice = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/get-all-regional-office-details?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllRegionalOfficeList = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-regional-office-details`
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
      `/api/contractor/get-all-regional-office-details`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getApproveExpensePunchDetails = async (id, complaint_id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/expense/expense-punch/get-list-expense-punch-approve_according_to_items?complaint_id=${complaint_id}&&user_id=${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllUsersForExpenses = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-users-for-expenses`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllItemMasterForDropdown = async (category) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-item-master-for-dropdown?category=${
        category || ""
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

// API'S FOR STOCK MANAGEMENT MODULE

export const postStockRequest = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/stock/save-stock-request`,
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

export const getApprovedStockRequest = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/stock/stock-request/get-all-approved-requested-stock?pageSize=${
        pageSize || ""
      }&&pageNo=${pageNo || ""}&&search=${search || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getStockRequest = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/stock/stock-request/get-all-requested-stock?search=${
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

export const getStockRequestById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/stock/stock-request/get-single-requested-stock-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllPreviousItemsStockList = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/stock/stock-request/get-all-items-in-stocks-by-userId/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateStockRequest = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/stock/stock-request/update-stock-request`,
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

export const postStockReject = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/stock/stock-request/rejected-stock-request`,
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
export const postRejectStockRequest = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/stock/stock-request/rejected-stock-request`,
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

export const postStockRequestStatus = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/stock/stock-request/change-stock-request`,
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

export const getRejectedStockRequest = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/stock/stock-request/get-all-rejected-requested-stock?pageSize=${
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

export const getAllStockRequest = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `api/contractor/stock/stock-request/get-all-stock-requests?pageSize=${
        pageSize || ""
      }&&pageNo=${pageNo || ""}&&search${search || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllPendingTransferStockRequest = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/stock/transfer-stock/get-all-pending-stock-transfer-request?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getTransferStock = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/stock/transfer-stock/get-transfer-stock?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllPaymentModes = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-payment-methods`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllPaymentMethod = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-payment-methods?search=${
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

export const getAllTransferStockRequest = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/stock/transfer-stock/get-all-transfer-stock?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S FOR STOCK PUNCH MANAGEMENT MODULE

export const getAllStockPunchRequest = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/stock-punch/stock-punch-request/get-stock-request-month-wise?search=${
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

export const getStockPunchRequestDetails = async (
  id,
  month,
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `api/contractor/stock-punch/stock-punch-request/get-all-stock-request-by-id/${id}?search=${
        month || ""
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

export const getStockPunchDetails = async (searchTerm, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/stock-punch/stock-punch-approve/get-all-stock-punch-list?search=${
        searchTerm || ""
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
export const getAllStockPunch = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/stock-punch/stock-punch-approve/get-all-stock-punch-list?search=${
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

export const getApprovedStockPunch = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);

    const { data } = await customApi.get(
      `/api/contractor/stock-punch/stock-punch-approve/get-all-approve-stock-punch?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getStockPunchFullDetails = async (id, complaint_id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/stock-punch/stock-punch-approve/get-stock-punch-details/${id}/${complaint_id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getSingleStockPunchById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/stock-punch/stock-punch-approve/get-stock-punch-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getStockPunchDetailsById = async (id, complaint_id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/stock-punch/stock-punch-approve/get-stock-punch-details/${id}/${complaint_id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postApproveStockPunch = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/stock-punch/stock-punch-approve/approve-stock-punch-quantity`,
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

export const getApproveStockPunchDetails = async (id, complaint_id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/stock-punch/stock-punch-approve/get-all-approve-stock-punch-by-id/${id}/${complaint_id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postStockPunch = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/stock-punch/save-stock-punch`,
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

export const getStockPunchTransferList = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/stock-punch/stock-punch-transfer/get-stock-quantity-transfer?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getStockPunchTransferedDetails = async (
  transfer_by,
  transfer_to
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/stock-punch/stock-punch-transfer/get-stock-quantity-transfer-by-id/${transfer_by}/${transfer_to}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postStockPunchTransfer = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/stock-punch/stock-punch-transfer/new-stock-transfer`,
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
      `/api/contractor/earthing-testing/add-earthing-testing-report`,
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
      `/api/contractor/earthing-testing/get-earthing-testing-lists?${queryParams}`
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
      `/api/contractor/earthing-testing/get-earthing-testing-detail/${id}`
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
      `/api/contractor/earthing-testing/update-earthing-testing-detail`,
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
      `/api/contractor/earthing-testing/approve-reject-earthing-testing-by-status?id=${
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
      `/api/contractor/billing/get-all-sale-in-ptm?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllOutletNameForPTM = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/billing/get-all-outlets-in-ptm?status=${status || ""}`
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
      `/api/contractor/billing/get-all-regionals-in-ptm?status=${status || ""}`
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
      `/api/contractor/billing/get-all-order-by-in-ptm?status=${status || ""}`
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
      `/api/contractor/billing/get-all-companies-in-ptm?status=${status || ""}`
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
      `/api/contractor/get-complaint-types?status=${status || ""}`
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
      `/api/contractor/get-complaint-types?status=${status || ""}`
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
      `/api/contractor/billing/get-all-po-in-billing?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllComplaintsForMeasurement = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/billing/get-resolved-complaint-in-billing?${queryParams}`
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
      `/api/contractor/billing/measurement/files-upload-in-billing`,
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
      `/api/contractor/billing/measurement/create-measurement`,
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
      `/api/contractor/billing/measurement/get-all-measurements-based-on-status?${queryParams}`
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
      `/api/contractor/billing/measurement/get-all-sales-in-billing?status=${
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
      `/api/contractor/billing/measurement/get-all-outlet-in-billing?status=${
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
      `/api/contractor/billing/measurement/get-all-regional-in-billing?status=${
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
      `/api/contractor/billing/measurement/get-all-order-by-for-measurements?${queryParams}`
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
      `/api/contractor/billing/measurement/get-all-companies-in-billing?status=${
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
      `/api/contractor/billing/measurement/get-measurements-details/${id}`
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
      `/api/contractor/billing/measurement/get-measurements-details/${id}`
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
      `/api/contractor/billing/measurement/get-measurements-details/${id}?pdf=${
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
      `/api/contractor/billing/measurement/get-pi-attachment-by-complaint-id/${id}`
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
      `/api/contractor/billing/measurement/get-all-approved-data/${id}`
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
      `/api/contractor/fetch-all-financial-years?search=${
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
export const getAllPoDetails = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/billing/get-all-po-details`
    );
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
      `/api/contractor/get-purchase-order-details-with-items/${po_id}`
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
      `/api/contractor/get-purchase-order-details-with-items/${id}`
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
      `/api/contractor/billing/measurement/get-measurements-timeline-details/${id}`
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
      `/api/contractor/billing/measurement/discard-measurement-details`,
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
      `/api/contractor/billing/measurement/get-po-exists-or-not?po=${
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
      `/api/contractor/billing/measurement/change-po-details-by-same-po`,
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
      `/api/contractor/get-all-sa-filters?status=${status || ""}&&po_id=${
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
      `/api/contractor/get-complaints-details/${id}`
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
      `/api/contractor/billing/performa-invoice/get-measurements-in-pi-status?${queryParams}`
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
      `/api/contractor/billing/performa-invoice/get-all-proforma-invoices?${queryParams}`
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
      `/api/contractor/billing/merged-performa/get-all-pi-merged-performa?${queryParams}`
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
      `/api/contractor/billing/merged-performa/get-all-merged-proforma-invoice?${queryParams}`
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
      `/api/contractor/billing/invoice/get-all-listing-pi-and-mpi?${queryParams}`
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
      `/api/contractor/billing/invoice/get-all-invoice-data?${queryParams}`
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
      `/api/contractor/billing/merged-invoice/get-all-merged-invoice?${queryParams}`
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
      `/api/contractor/billing/payments/get-all-invoice-in-payments?search=${
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
      `/api/contractor/billing/payment-received/listing-pv-number?status=${
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
      `/api/contractor/billing/retention/get-payment-received-in-retention-by-status?search=${
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
      `/api/contractor/billing/retention/get-all-payment-retention?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S FOR OFFICE INSPECTION MODULE

export const getOfficeExpenseRequest = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/office-inspection/get-all-outlet-with-complaints?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getOfficeExpenseRequestForPartial = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/office-inspection/stock-office-expense-partial-by-office?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getOfficeExpenseRequestForApproved = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/office-inspection/stock-office-expense-approved-by-office?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getOfficeExpenseRequestByOutletIdForPending = async ({
  outlet_id,
  month,
  params,
}) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/office-inspection/get-all-outlet-with-complaints-by-id/${
        outlet_id || null
      }/${month}?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postStockPunchApproveByOffice = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/office-inspection/stock-punch-approve-by-office`,
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

export const getOfficeExpenseRequestByOutletIdForApproved = async (
  outlet_id,
  month
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/office-inspection/get-office-approved-by-id/${
        outlet_id || null
      }/${month}
        `
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getOfficeExpenseRequestByOutletIdForPartial = async (
  outlet_id,
  month
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/office-inspection/get-stock-office-partial-by-id/${
        outlet_id || null
      }/${month}
        `
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postFundPunchApproveByOffice = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/office-inspection/fund-punch-approve-by-office`,
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
export const getOfficePendingFundRequest = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/office-inspection/get-all-outlet-with-complaints-funds?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getOfficeFundRequestByOutletIdForPending = async ({
  outlet_id,
  month,
  params,
}) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/office-inspection/get-all-outlet-with-complaints-funds-by-id/${
        outlet_id || null
      }/${month}?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getOfficeFundRequestForPartial = async (
  sales_area_id,
  regional_office_id,
  outlet_id,
  pageSize,
  pageNo,
  search
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/office-inspection/fund-office-expense-partial-by-office?outlet_id=${
        outlet_id || ""
      }&&regional_office_id=${regional_office_id || ""}&&sales_area_id=${
        sales_area_id || ""
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

export const getOfficeFundRequestByOutletIdForPartial = async (
  outlet_id,
  month
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/office-inspection/get-fund-office-partial-by-id/${
        outlet_id || null
      }/${month}
        `
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getOfficeFundRequestForApproved = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/office-inspection/fund-office-expense-approved-by-office?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getOfficeFundRequestByOutletIdForApproved = async (
  outlet_id,
  month
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/office-inspection/get-office-approved_fund-by-id/${
        outlet_id || null
      }/${month}
        `
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllOutletForFundInOffice = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/office-inspection/get-outlet-office-by-id-for-fund?status=${
        status ?? ""
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

export const getAllSalesForFundInOffice = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/office-inspection/get-sales-area-office-by-id-for-fund?status=${status}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllRegionalForFundInOffice = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/office-inspection/get-regional-office-expense-by-id-for-fund?status=${
        status ?? ""
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

// API'S FOR SITE INSPECTION MODULE
export const getSiteExpensePendingRequest = async (
  sales_area_id,
  regional_office_id,
  outlet_id,
  pageSize,
  pageNo,
  search
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/site-inspection/get-all-site-inspections?outlet_id=${
        outlet_id || ""
      }&&regional_office_id=${regional_office_id || ""}&&sales_area_id=${
        sales_area_id || ""
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

export const getPartialExpenseOfSiteInspection = async (
  sales_area_id,
  regional_office_id,
  outlet_id,
  pageSize,
  pageNo,
  search
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/site-inspection/get-partial-site-inspections?outlet_id=${
        outlet_id || ""
      }&&regional_office_id=${regional_office_id || ""}&&sales_area_id=${
        sales_area_id || ""
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

export const getSiteExpenseRequestForApproved = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/site-inspection/get-approved-site-inspections?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getPendingSiteExpenseRequestData = async (outlet_id, month) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/site-inspection/get-site-inspections-by-id/${
        outlet_id || null
      }/${month}
        `
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postStockPunchApproveBySite = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/contractor/site-inspection/approved-site-inspections`,
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

export const getApprovedSiteExpenseRequestData = async (outlet_id, month) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/site-inspection/get-site-inspections-approved-by-id/${
        outlet_id || null
      }/${month}
        `
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postAssignEmployeeforFund = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/contractor/site-inspection/assign-complaints-in-fund-site-inspection`,
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

// API'S FOR PURCHASE AND SALES MODULE

// PURCHASE ORDER

export const postPurchaseOrder = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/purchase-sale/purchase/create-po-order`,
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
      `/api/contractor/purchase-sale/purchase/get-all-generated-po?${queryParams}`
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
      `/api/contractor/purchase-sale/get-ro-for-po?status=${
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
      `/api/contractor/purchase-sale/get-po-number-for-po?status=${
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
      `/api/contractor/purchase-sale/approve-purchase-order`,
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
      `/api/contractor/purchase-sale/purchase/approve-update-purchase-order`,
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
      `/api/contractor/purchase-sale/get-security-unique-id?status=${
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
      `/api/contractor/purchase-sale/purchase/get-single-po-details/${id}?pageSize=${
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
    const { data } = await customApi.get(`/api/contractor/get-from-companies`);
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
      `/api/contractor/purchase-sale/purchase/update-po-details`,
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
      `/api/contractor/purchase-sale/purchase/delete-po-details/${id}`
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
      `/api/contractor/purchase-sale/check-po-is-exists?search_value=${search}`
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
      `/api/contractor/purchase-sale/get-po-details-on-ro/${id}`
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
      `/api/contractor/purchase-sale/get-tax-calculation-type`,
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
    const { data } = await customApi.get(`/api/contractor/get-all-gst-type`);
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
      `/api/contractor/purchase-sale/purchase/change-po-status`,
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
      `/api/contractor/purchase-sale/sales/create-so-order`,
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
      `/api/contractor/purchase-sale/sales/update-so-details`,
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
      `/api/contractor/purchase-sale/sales/get-all-generated-so?${queryParams}`
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
      `/api/contractor/purchase-sale/sales/get-single-so-details/${id}?${queryParams}`
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
      `/api/contractor/purchase-sale/sales/delete-so-details/${id}`
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
      `/api/contractor/purchase-sale/check-so-is-exists?search_value=${search}`
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
      `/api/contractor/purchase-sale/sales/change-so-status`,
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
      `/api/contractor/purchase-sale/approve-sales-order`,
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
      `/api/contractor/purchase-sale/approve-update-sales-order`,
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
      `/api/contractor/purchase-sale/get-sales-security-unique-id?status=${
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
      `/api/contractor/purchase-sale/get-ro-for-so?status=${status || ""}`
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
      `/api/contractor/purchase-sale/get-so-number-for-so?status=${
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
      `/api/contractor/quotations/create-quotation`,
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
      `/api/contractor/quotations/get-quotation?status=${
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
      `/api/contractor/quotations/get-quotation-by-id/${id}`
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
      `/api/contractor/quotations/update-quotation/${values.id}`,
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
      `/api/contractor/quotations/delete-quotation/${id}`
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
    const { data } = await customApi.post(
      `/api/contractor/quotations/approve-rejected-quotation-by-id?status=${
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

// API'S FOR PRODUCT MANAGEMENT MODULE

// CATEGORY

export const postProductCategory = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/product-management/category/create-category`,
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
export const getAllProductCategory = async ({
  search,
  pageSize,
  pageNo,
  isDropdown,
}) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/product-management/category/get-all-category?search=${
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
export const getSingleProductCategoryById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/product-management/category/get-category-detail/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const updateProductCategory = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/product-management/category/update-category-detail`,
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

export const deleteProductCategoryById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/product-management/category/delete-category-detail/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// UNIT

export const postUnitData = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/product-management/unit/create-unit-data`,
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

export const getAllUnitData = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/product-management/unit/get-all-unit-data?search=${
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
export const getSingleUnitDataById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/product-management/unit/get-unit-data-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const updateUnitData = async (id, values) => {
  try {
    const { data } = await customApi.put(
      `/api/contractor/product-management/unit/update-unit-data-by-id/${id}`,
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
export const deleteUnitDataById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/product-management/unit/delete-unit-data-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// PRODUCT
export const getAllProductDetails = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/product-management/product/product-list?search=${
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
export const postProductDetails = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/product-management/product/product-add`,
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
export const getSingleProductById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/product-management/product/product-detail/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const updateProductDetails = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/product-management/product/product-detail-update`,
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
export const postPublishStatusUpdate = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/product-management/product/product-publish-status-update`,
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

// API'S FOR ASSETS MANAGEMENT MODULE

export const postAssets = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/assets/add-new-assets`,
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

export const getAllAssets = async ({
  search,
  pageSize,
  pageNo,
  isDropdown,
  status,
}) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/assets/get-all-stored-assets?status=${
        status || ""
      }&&search=${search || ""}&&pageSize=${pageSize || ""}&&pageNo=${
        pageNo || ""
      }&&isDropdown=${isDropdown || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getSingleAssetsById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/assets/get-stored-assets-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const updateAssets = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/assets/update-stored-assets`,
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
export const deleteAssetsById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/assets/delete-stored-assets/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postAssignedAssetToUser = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/contractor/assets/assigned-asset-to-user`,
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
export const getAllAssignedAssetsToUser = async ({
  search,
  pageSize,
  pageNo,
}) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/assets/get-all-assigned-asset-to-users?search=${
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
export const approveRejectAssetsManagementById = async (status, assestsId) => {
  try {
    const { data } = await customApi.put(
      `/api/contractor/assets/approve-reject-assets-by-status?status=${
        status || ""
      }&&id=${assestsId || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const sendToRepair = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/assets/repair-assets`,
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
export const getAssetsTimelineHistoryById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-assets-with-timeline-history/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S FOR COMMUNICATION MODULE

export const getNewUserChat = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/communication/add-new-user-to-chat`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllMessages = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/communication/get-messages`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const AddnewUsertoChat = async (id) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/communication/start-chat-to-new-user/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllSendMessages = async (
  search,
  pageSize,
  pageNo,
  upcoming,
  status
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/communication/get-all-messages?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&upcoming=${
        upcoming || ""
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

// API'S FOR HR  MANAGEMENT MODULE

// ATTENDANCE

export const getAllUsersAttendanceInCalendar = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/hr-attendance/get-all-users-attendance-in-calendar-view?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postMarkManualAttendance = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/contractor/hr-attendance/mark-manual-attendance`,
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
export const postMarkBulkAttendance = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/hr-attendance/mark-attendance-in-bulk`,
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
      `/api/contractor/master-data/bank/get-bank-list?search=${
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
      `/api/contractor/master-data/bank/add-bank-details`,
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
      `/api/contractor/master-data/bank/get-bank-details/${id}`
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
      `/api/contractor/master-data/bank/update-bank-details`,
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
      `/api/contractor/master-data/accounts/add-bank-account-details`,
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
      `/api/contractor/master-data/accounts/get-all-account-details?search=${
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
      `/api/contractor/master-data/accounts/account-details-by-id/${id}`
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
      `/api/contractor/master-data/accounts/get-account-transaction-history/${id}?date=${filterBy}&&pageSize=${
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
      `/api/contractor/master-data/accounts/update-account-details`,
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
      `/api/contractor/master-data/accounts/delete-account-details/${id}`
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
      `/api/contractor/master-data/financial-year/create-financial-year`,
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
      `/api/contractor/master-data/financial-year/fetch-financial-year-by-id/${id}`
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
      `/api/contractor/master-data/financial-year/update-financial-year-by-id/${id}`,
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
      `/api/contractor/master-data/financial-year/delete-financial-year-by-id/${id}`
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
      `/api/contractor/master-data/tax/get-all-saved-gst-masters?search=${
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
      `/api/contractor/master-data/tax/save-gst-details`,
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
      `/api/contractor/master-data/tax/update-gst-details`,
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
      `/api/contractor/master-data/tax/delete-gst-details/${id}`
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
      `/api/contractor/master-data/tax/get-saved-gst-details/${id}`
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
      `/api/contractor/master-data/bill-format/generate-invoice-number-format`,
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
      `/api/contractor/master-data/bill-format/get-all-generate-invoice-formats?search=${
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
      `/api/contractor/master-data/bill-format/update-invoice-number-format`,
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
      `/api/contractor/master-data/bill-format/get-invoice-number-format-details/${id}`
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
      `/api/contractor/master-data/bill-format/delete-invoice-number-format-details/${id}`
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
      `/api/contractor/master-data/bill-format/update-invoice-number-format-status`,
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
      `/api/contractor/master-data/employee-format/generate-employee-number-format`,
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
      `/api/contractor/master-data/employee-format/get-all-employee-number-formats?search=${
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
      `/api/contractor/master-data/employee-format/update-employee-number-format`,
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
      `/api/contractor/master-data/employee-format/get-employee-number-format-details/${id}`
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
      `/api/contractor/master-data/employee-format/delete-employee-number-format-details/${id}`
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
      `/api/contractor/master-data/employee-format/update-employee-number-format-status`,
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
      `/api/contractor/master-data/client-vendor-format/generate-client-vendor-number-format`,
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
      `/api/contractor/master-data/client-vendor-format/get-all-client-vendor-number-formats?search=${
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
      `/api/contractor/master-data/client-vendor-format/update-client-vendor-number-format`,
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
      `/api/contractor/master-data/client-vendor-format/get-client-vendor-number-format-details/${id}`
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
      `/api/contractor/master-data/client-vendor-format/delete-client-vendor-number-format-details/${id}`
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
      `/api/contractor/master-data/client-vendor-format/update-client-vendor-number-format-status`,
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
      `/api/contractor/master-data/item-format/generate-item-number-format`,
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
      `/api/contractor/master-data/item-format/get-all-item-number-formats?search=${
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
      `/api/contractor/master-data/item-format/update-item-number-format`,
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
      `/api/contractor/master-data/item-format/get-item-number-format-details/${id}`
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
      `/api/contractor/master-data/item-format/delete-item-number-format-details/${id}`
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
      `/api/contractor/master-data/item-format/update-item-number-format-status`,
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
      `/api/contractor/master-data/payment-method/add-payment-method`,
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
      `/api/contractor/master-data/payment-method/update-payment-method`,
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
      `/api/contractor/master-data/payment-method/delete-payment-methods/${id}`
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
      `/api/contractor/master-data/payment-method/get-single-payment-method-details/${id}`
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
      `/api/contractor/master-data/add-balance/add-wallet-amount`,
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
      `/api/contractor/feedback-suggestion/create-feedback-and-complaint`,
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
      `/api/contractor/feedback-suggestion/get-all-feedback-and-complaint?search=${
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
      `/api/contractor/feedback-suggestion/get-feedback-and-complaint/${id}`
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
      `/api/contractor/feedback-suggestion/delete-feedback-and-complaint/${id}`
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
      `/api/contractor/feedback-suggestion/add-response/${id}`,
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

// API'S FOR IMPORT MODULE **************

// upload company using csv file
export const uploadCompany = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/company/import-companies`,
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
      `/api/contractor/complaints/import-complaint`,
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
      `/api/contractor/fuel-station/import-outlet`,
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

// **************PREVIOUS API'S ****************

export const getAllUnitMasterForDropdown = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-unit-data-list`
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
      `/api/contractor/get-all-brand-markdown`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllSubCategory = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/get-all-sub-category?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllAssignedAssets = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-assigned-assets`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAssetsTimelineById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-assets-timeline-history/${id}`
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
      `/api/contractor/reactive-to-discard-measurements`,
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
      `/api/contractor/billing/measurement/get-all-complaint-types-in-billing?status=${
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
export const updateHardCopiesInMeasurements = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-pi-attachment-complaint`,
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
export const getAllOutletforfilter = async (
  status,
  po_id,
  ro_id,
  sale_area_id
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-outlet-filters?status=${status || ""}&&po_id=${
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
      `/api/contractor/get-all-complaint-types-filters?${queryParams}`
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
      `/api/contractor/get-area-manager?status=${status || ""}&&po_id=${
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
      `/api/contractor/get-all-po-filters?status=${status || ""}`
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
      `/api/contractor/get-all-ro-filters?status=${status || ""}`
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
      `/api/contractor/get-all-complaints-in-pi?${queryParams}`
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
      `/api/contractor/get-all-po-from-proforma?${queryParams}`
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
      `/api/contractor/get-all-ro-from-proforma?${queryParams}`
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
      `/api/contractor/get-all-bill-from-proforma?status=${
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
      `/api/contractor/discard-proforma-invoice/${id}`
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
      `/api/contractor/get-all-sales-area-from-proforma?${queryParams}`
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
      `/api/contractor/get-all-outlet-from-proforma?${queryParams}`
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
      `/api/contractor/get-all-complaint-types-from-proforma?${queryParams}`
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
      `/api/contractor/get-all-financial-year-from-proforma?status=${
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
      `/api/contractor/billing/performa-invoice/get-single-proforma-invoice/${id}?pdf=${
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
      `/api/contractor/billing/merged-performa/get-merged-proforma-invoice/${id}?pdf=${
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
      `/api/contractor/get-discard-measurements-details/${id}`
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
      `/api/contractor/billing/measurement/update-measurement-details`,
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
      `/api/contractor/get-my-company-list?isDropdown=${isDropdown || ""}`
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
      `/api/contractor/get-items-on-measurement-id/${id}`
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
      `/api/contractor/get-measurements-detail-po?po_id=${
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
      `/api/contractor/billing/performa-invoice/update-proforma-invoice-details`,
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
      `/api/contractor/billing/performa-invoice/generate-proforma-invoice`,
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
export const getSingleTaxesById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-tax-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getSingleMessages = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-sender-messages/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getMessagesMarkRead = async (id) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/sender-messages-mark-read/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllBillingType = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-billing-types?search=${search || ""}&&pageSize=${
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
export const updateTaxes = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-tax-details`,
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
export const postTaxes = async (values) => {
  try {
    const { data } = await customApi.post(`/api/contractor/create-tax`, values);
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
      `/api/contractor/discard-invoice/${id}`
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
      `/api/contractor/billing/invoice/get-single-invoice-details/${id}?pdf=${
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
      `/api/contractor/get-all-financial-year-from-proforma?${queryParams}`
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
      `/api/contractor/ro-to-billing-from-company?${queryParams}`
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
      `/api/contractor/from-billing-to-company?${queryParams}`
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
      `/api/contractor/billing/invoice/get-all-pi-listing`,
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
      `/api/contractor/billing/invoice/update-invoice-data`,
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
      `/api/contractor/billing/invoice/create-invoice-data`,
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
      `/api/contractor/get-all-measurements?search=${search || ""}&&pageSize=${
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
      `/api/contractor/delete-measurements-details/${id}`
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
      `/api/contractor/get-all-po-for-invoices?status=${status || ""}`
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
      `/api/contractor/get-all-ro-for-invoice?${queryParams}`
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
      `/api/contractor/get-all-sales-area-for-invoice?${queryParams}`
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
      `/api/contractor/get-all-complaint-types-for-invoice?${queryParams}`
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
      `/api/contractor/get-all-billing_from-company-invoice?${queryParams}`
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
      `/api/contractor/get-all-billing-to-company-invoice?${queryParams}`
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
      `/api/contractor/billing/merged-invoice/merge-invoice`,
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
      `/api/contractor/discard-merged-invoice/${id}`
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
      `/api/contractor/billing/merged-invoice/get-merged-invoice-by-id/${id}?pdf=${
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
      `/api/contractor/discard-merged-pi`,
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
      `/api/contractor/billing/merged-performa/merged-proforma-invoice`,
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
      `/api/contractor/get-payment-received-by-id/${id}`
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
      `/api/contractor/get-all-invoice-data-by-id/${id}`
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
      `/api/contractor/billing/payment-received/update-payment-received-by-id`,
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
      `/api/contractor/billing/payments/add-payment-to-invoice`,
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
      `/api/contractor/get-payment-received-by-id/${id}`
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
      `/api/contractor/get-payment-history?id=${id || ""}`
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
      `/api/contractor/get-payment-paid?status=${status || ""}&&search=${
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
      `/api/contractor/get-ro-for-dropdown?${queryParams}`
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
      `/api/contractor/get-retention-id-for-dropdown?${queryParams}`
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
      `/api/contractor/update-payment-retention-status`,
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
      `/api/contractor/get-po-for-payment-retention?${queryParams}`
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
      `/api/contractor/get-payment-paid-by-id/${id}`
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
      `/api/contractor/otp-verify-in-payment-paid`,
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
      `/api/contractor/get-all-complaints-via-invoice?search=${
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
      `/api/contractor/get-ro-in-paid-payment`
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
      `/api/contractor/get-area-manager-in-paid-payment`
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
      `/api/contractor/payment-paid`,
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
      `/api/contractor/resend-otp-in-payment-paid`,
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
      `/api/contractor/get-po-details-in-ro-payments-by-id/${id}`
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
      `/api/contractor/delete-proforma-invoice/${id}`
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
      `/api/contractor/merge-pi-to-invoice`,
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
      `/api/contractor/get-sales-area-for-dropdown?${queryParams}`
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
      `/api/contractor/get-outlet-for-dropdown?${queryParams}`
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
      `/api/contractor/get-complaint-type-for-dropdown?${queryParams}`
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
      `/api/contractor/get-billing-from-for-dropdown?${queryParams}`
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
      `/api/contractor/get-billing-to-for-dropdown?${queryParams}`
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
      `/api/contractor/billing/retention/approve-payment-retention`,
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
      `/api/contractor/billing/retention/update-payment-amount-retention`,
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
      `/api/contractor/billing/retention/get-payment-retention-by-id/${id}?pdf=${
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
      `/api/contractor/billing/retention/update-payment-retention`,
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
      `/api/contractor/billing/retention/discard-payment-retention/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllTaxes = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-taxes?search=${search || ""}&&pageSize=${
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
export const deleteTaxesById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-tax-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getMeasurementsById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-measurements-detail-by-po/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllComplaintIdList = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-complaints-list-dropdown`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getStockRequestDetailsOnItemId = async (id, user_id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-stock-details-on-item-id/${id}/${user_id || 0}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getUserDetailsByComplaintId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-user-details-by-complaint-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAreaManagerOfUser = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-area-manager-of-user/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const deleteMessageById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-message/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllDealerContacts = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-dealer-users?search=${search || ""}&&pageSize=${
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
export const getSendMessagesById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-message-by-id/${id}`
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
      `/api/contractor/update-message`,
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
export const getAllComplaintList = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-complaint-list`
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
    const { data } = await customApi.get(`/api/contractor/get-outlet-list`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllAreaManager = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-managers-users`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllComplaintIdListMangerWise = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-area-manager-to-complaints/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllComplaintIdListOfficeWise = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-regional-office-to-complaints/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getItemPriceDetails = async (id, userId) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-approve-item-price/${id}/${userId}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postAddFunds = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/add-fund-user-wallet`,
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
export const getAllApprovedCashRequest = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-approved-cash-request-list?search=${
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
export const getSingleRequestCashById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-cash-requested-detail/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const updateRequestCash = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-cash-requested-detail`,
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
export const postRequestCash = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/request-cash`,
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
export const getSingleExpenseCategoryById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-expense-category/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const updateExpenseCategory = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-expense-category`,
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
export const postExpenseCategory = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/add-expense-category`,
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
export const getAllExpenseCategory = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-expense-category?search=${
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
export const deleteExpenseCategoryById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-expense-category/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getSingleExpensesCashById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-expense-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllExpenseCategoryForDropdown = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-expense-category-for-dropdown`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllPaymentMethodForDropdown = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-payment-methods-for-dropdown`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const updateExpensesCash = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-expense-details`,
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
export const postExpensesCash = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/add-expense-cash`,
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

export const getAllRegionalOrderBy = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-regional-order-by`
    );
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
    const { data } = await customApi.get(`/api/contractor/get-all-supervisors`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getComplaintsFreeUsersCount = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-free-end-users-count`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getManagerFreeTeamMembers = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-manager-free-team-members/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postReactiveRejectFundRequestet = async (id) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/reactive-reject-fund-requestet/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllPreviousItemsList = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-fund-request-items-by-user-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getPreviousFundRequestById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-fund-request-details-by-request-for/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getPreviousStockRequestById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-stock-request-details-by-request-for/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postTransferFundRequest = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/transfer-fund`,
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

export const deleteStockRequestById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-stock-request/${id}`
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
      `/api/contractor/quotations/get-quotation?search=${
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

export const postPaymentPaidInRo = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/add-ro-payment-paid`,
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

// post api for create ro payement
export const PostPaymentForRo = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-ro-payment-paid`,
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

export const getSendByEmailQuotation = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/quotation-send-by-email`,
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

//  all office Expense Api's
export const getAllEmployeeComplaints = async (
  pageSize,
  pageNo,
  search,
  formattedDate
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-employee-history-with-complaints?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&month=${
        formattedDate || ""
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

// area manager

export const getAllAreaManagerTransactionById = async (
  search,
  pageSize,
  pageNo,
  id
) => {
  try {
    const { data } = await customApi(
      `/api/contractor/get-area-manager-transactions?id=${id}&&search=${
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

export const getAllRegionalOfficeTransactionById = async (
  search,
  pageSize,
  pageNo,
  id
) => {
  try {
    const { data } = await customApi(
      `/api/contractor/get-transactions-ro-by-id?id=${id}&&search=${
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

// get all purchase order transactions
export const getAllPOTransactionById = async (search, pageSize, pageNo, id) => {
  try {
    const { data } = await customApi(
      `/api/contractor/get-transactions-po-by-id?id=${id}&&search=${
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
export const getAllAreaManagerTransaction = async (
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi(
      `/api/contractor/get-all-area-manager-transactions?search=${
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

// get all regional office transactions
export const getAllROTransactions = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi(
      `/api/contractor/get-transactions-balance-of-ro?search=${
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

// get all purchase order transactions
export const getAllPOTransactions = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi(
      `/api/contractor/get-transactions-balance-of-po?search=${
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

// setting
export const getAllAreaManagerList = async (
  search,
  pageSize,
  pageNo,
  status
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-manager-list-with-total-free-end-users?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&status=${
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

export const postPaymentSetting = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-payment-setting`,
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
export const postPromotionalManagerSetting = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/add-promotional-manager`,
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

export const updatePaymentSetting = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-payment-setting`,
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
export const updatePromotionalSetting = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-promotional-manager`,
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

export const getPromotionalSettingById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-promotional-manager/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getPaymentsettingById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-payment-setting-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllPaymentsetting = async (
  search,
  pageSize,
  pageNo,
  status
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-payment-setting?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&status=${
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
export const getAllPromotionalsetting = async (
  search,
  pageSize,
  pageNo,
  status
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-promotional-manager?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&status=${
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

// get all discards complaints in bill management
export const getAllDiscardsComplains = async (pageSize, pageNo, search) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-discard-measurements?search=${
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

// get Api for view of pending fund in Site Inspection
export const getPendingFundInSiteInspection = async (outlet_id, month) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-pending-site-complaints-for-funds-id/${
        outlet_id || null
      }/${month}
        `
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get Api for view of  partial fund in Site Inspection
export const getPartialFundInSiteInspection = async (outlet_id, month) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-partial-site-complaints-for-funds-id/${
        outlet_id || null
      }/${month}
        `
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get Api for view of  approve fund in Site Inspection
export const getApprovedFundInSiteInspection = async (outlet_id, month) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-approved-site-complaints-for-funds-id/${
        outlet_id || null
      }/${month}
        `
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get Api for view of partial site expense request
export const getPartialSiteExpenseRequestData = async (outlet_id, month) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-site-inspections-partial-by-id/${
        outlet_id || null
      }/${month}
        `
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postFundPunchApproveBySite = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/approve-site-inspection-for-fund`,
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

//get api for Listing of payment process in regional office
export const getAllProcessPaymentForRO = async (
  status,
  pageSize,
  pageNo,
  search
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-ro-payment-paid?status=${status || ""}&&search=${
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

export const getAllPurchaseOrderListingInPayment = async (
  pageSize,
  pageNo,
  search
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-po-details-in-ro-payments?search=${
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
export const getAllRegionalOfficeListing = async (
  pageSize,
  pageNo,
  search,
  ro_id,
  po_id
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-complaints-via-invoice-ro?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&ro=${
        ro_id || ""
      }&&po_number=${po_id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// paid invoices

export const getAllPoInPaymentPaid = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-po-in-paid-payment`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

//get api for invoices details in payment paid module
export const getInvoicesDetailsPaymentPaid = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-complaints-by-id?complaint_id=${id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

//get api for details of invoice which are reieved payment for retention money
export const getDetailsOfPaymentPaidForRO = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-ro-payment-paid-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

//get api for view Process To Measurement
export const getDetailsForProcessToMeasurement = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-attachment-and-inspection-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

//get api for pending fund inspection
export const getPendingFundRequestInSite = async (
  sales_area_id,
  regional_office_id,
  outlet_id,
  pageSize,
  pageNo,
  search
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-pending-site-complaints-for-funds?outlet_id=${
        outlet_id || ""
      }&&regional_office_id=${regional_office_id || ""}&&sales_area_id=${
        sales_area_id || ""
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

//get api for partial fund inspection
export const getPartialFundRequestInSite = async (
  sales_area_id,
  regional_office_id,
  outlet_id,
  pageSize,
  pageNo,
  search
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-partial-site-complaints-for-funds?outlet_id=${
        outlet_id || ""
      }&&regional_office_id=${regional_office_id || ""}&&sales_area_id=${
        sales_area_id || ""
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

//get api for approved fund inspection
export const getApprovedFundRequestInSite = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/get-approved-site-complaints-for-funds?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Company Api's

export const getEnergyCompanydata = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-active-energy-companies`
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
      `/api/contractor/get-outlet-by-sale-area/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSignleBillingTypeById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-billing-types/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postBillingType = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-billing-types`,
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
export const updateBillingType = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-billing-types`,
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
export const deleteBillingTypeById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-billing-type/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Proforma Invoice Api's
export const getAllProformaInvoice = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-proforma-invoices?search=${
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
export const getSingleProformaInvoiceById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-proforma-invoice/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Invoice Api's
export const getAllInvoice = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-invoice-data?search=${search || ""}&&pageSize=${
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

export const getSingleInvoiceById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-invoice-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteInvoiceById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-invoice-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// from company list used in purchase order
export const getFromCompanyList = async (isDropdown) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/all-sale-companies?isDropdown=${isDropdown || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// to company list used in purchase order
export const getToCompanyList = async (isDropdown) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-my-company-list?isDropdown=${isDropdown || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// download uploaded csv and sample csv file in purchase order
export const downloadCsvFile = async () => {
  try {
    const response = await customApi.get(
      `/api/contractor/download-csv-purchase-order-items`
    );
    return response;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllBrandForStockPunch = async (itemId) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-brands-by-item-id/${itemId}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllItemMasterForStockPunch = async (userId) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-user-stock-items-lists/${userId}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

//get all brand name in item master

// All Security Deposit Api's
export const getAllSecurityDeposit = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-security-money-list?search=${
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
export const postSecurityDeposit = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/add-security-money`,
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
export const updateSecurityDeposit = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-security-money-details`,
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
export const getSingleSecurityDepositById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-security-money-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const deleteSecurityDepositById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-security-money-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Product Details Api's
export const getSingleProductDetailsById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/product-detail/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteProductDetailsById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-product/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllBrand = async ({ search, pageSize, pageNo, isDropdown }) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/item-master/get-all-brand?search=${
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

export const postBrand = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/item-master/create-brand`,
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
      `/api/contractor/item-master/update-brand`,
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

export const getSingleBrandById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/item-master/get-brand-by-id/${id}`
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
      `/api/contractor/item-master/delete-brand/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Sub Category Api's

export const createSubCategory = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/item-master/add-sub-category`,
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

export const updateSubCategory = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/item-master/edit-sub-category`,
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

export const getSingleSubCategoryById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/item-master/get-sub-category-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteSubCategoryById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/item-master/delete-sub-category/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Sales Area Api's
export const getAllSalesArea = async () => {
  try {
    const { data } = await customApi.get(`/api/contractor/sales-area`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Sales Area Api's for office expense inspection
export const getAllSalesAreaForOfficeInspection = async () => {
  try {
    const { data } = await customApi.get(`/api/contractor/get-sales-area-list`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllActiveSalesArea = async () => {
  try {
    const { data } = await customApi.get(`/api/contractor/active-sales-area`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Office Inspection Api's
export const getAllOutletAndSaleAreaList = async (
  search,
  pageSize,
  pageNo,
  id
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-outlet-and-sale-area-list/${id}?search=${
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
export const getAllComplaintsOnOutlet = async (
  search,
  pageSize,
  pageNo,
  id
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-complaints-on-outlet/${id}?search=${
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
export const getAllPendingComplaints = async (search, pageSize, pageNo, id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-pending-used-items-on-complaint/${id}?search=${
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
export const postApprovedUsedItems = async (id) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/approved-used-items-on-complaint/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllApprovedComplaints = async (
  search,
  pageSize,
  pageNo,
  id
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-approved-used-items-on-complaint/${id}?search=${
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
export const postAssignComplaint = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/assign-complaint-module-to-user`,
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
export const postAssignMultipleComplaint = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/assign-multiple-complaint-module-to-user`,
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
export const getAllOutletForDropdown = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-outlet-for-dropdown`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Office Inspection Item Stock Api's
export const getOfficeInspectionItemsStock = async (
  search,
  pageSize,
  pageNo,
  id,
  status
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-punch-stocks/${id}/${status}?search=${
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
export const getSingleOfficeInspectionItemsStock = async (id, status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-punch-stocks-details/${id}/${status}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postOfficeInspectionItemsStock = async (id) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/approved-punch-stocks-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Idle Assets Api's
export const getAllIdleAssets = async ({
  search,
  pageSize,
  pageNo,
  isDropdown,
}) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-idle-asset-list?search=${
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

// All Asset repair require Api's
export const getAllAssetRepairRequire = async ({
  search,
  pageSize,
  pageNo,
  isDropdown,
}) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-repair-requested-asset-list?search=${
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
export const postAssetRepairRequire = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/request-asset-repair`,
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
export const updateAssetRepairRequire = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-repair-requested-details`,
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
export const postMarkRequestViewed = async (id) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/mark-request-viewed/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getSingleAssetRepairRequireById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-repair-requested-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const deleteAssetRepairRequireById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-repair-requested-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Work Images  Api's
export const getAllWorkImages = async ({
  search,
  pageSize,
  pageNo,
  isDropdown,
  status,
}) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-uploaded-complaint-images?status=${
        status || ""
      }&&search=${search || ""}&&pageSize=${pageSize || ""}&&pageNo=${
        pageNo || ""
      }&&isDropdown=${isDropdown || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getSingleWorkImagesById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-uploaded-complaint-images/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postWorkImages = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/upload-complaint-images`,
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
export const updateWorkImages = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-uploaded-complaint-images`,
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
export const deleteWorkImagesById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-uploaded-complaint-images/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const approveRejectWorkImageById = async (status, workImageId) => {
  try {
    const { data } = await customApi.put(
      `/api/contractor/approve-reject-complaint-images-by-status?status=${
        status || ""
      }&&id=${workImageId || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleComplaintDetails = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-complaint-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getFreeEndUsers = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-end-user-details`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postEarthingTestingEarthPitReport = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/earth-pit-reports`,
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
      `/api/contractor/change-earthing-testing-status`,
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

// Gst Type's Api's

export const getFundRequestDetailsOnItemId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-fund-request-details-on-item-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getFundRequest4LowPriceOnItemId = async (id, category) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-fund-request-4-low-price/${id}/${category}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getFundRequest3BrandNameByItem = async (category, itemName) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-price-by-brand?category=${category}&&itemName=${itemName}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getFundRequest4SubLowPriceOnItemId = async (id, supplierId) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-last-three-prev-price-by-supplier/${id}/${supplierId}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

//get item price in create stock punch transfer
export const getItemPriceDetailsStockPunch = async (id, request_by) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/stock-punch-get-approve-item-price/${id}/${request_by}`
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
      `/api/contractor/import-bank-details`,
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

// All Stocks Api's
export const getAllStocks = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-items-stocks-report?search=${
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
export const postTransferStock = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/transfer-stock`,
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
export const getSingleStockById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-item-stock-distribution-report/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Level Wise Api's
export const getLevelOne = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-logged-user-details-and-type`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getUserOnRoleWise = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-user-on-role-level-wise/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postUserOnRoleWise = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/save-user-hierarchy-level-wise`,
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

// All Food Expenses Api's
export const getFoodExpenses = async () => {
  try {
    const { data } = await customApi.get(`/api/contractor/get-food-expense`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postPunchFoodExpenses = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/punch-food-expense`,
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

// Pi To Merge Api's
export const getAllPiOnPoNumber = async (search, pageSize, pageNo, id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-pi-on-po-number/${id}?search=${
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

// All Fund Management Api's
export const getUserWalletBalance = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-user-wallet-balance?user_id=${id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getUserTransactionMonthly = async (
  id,
  date,
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-user-transaction-monthly?user_id=${
        id || ""
      }&&year_month=${date || ""}&&search=${search || ""}&&pageSize=${
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
export const getCashRequestStatusTracked = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-cash-request-status-tracked?user_id=${id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getUserTransactionHistory = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-user-transaction-history?user_id=${id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getUserAllTransactionReport = async (
  search,
  pageSize,
  pageNo,
  id
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/user-all-transaction-report?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&user_id=${
        id || ""
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

// All Request Cash Api's
export const getAllRequestCash = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-logged-user-cash-requested?search=${
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

export const deleteRequestCashById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-cash-request/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllRejectedCashRequest = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-rejected-cash-request-list?search=${
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

// All Expense Cash Api's
export const getAllExpensesCash = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-logged-user-expenses?search=${
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

export const deleteExpensesCashById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-expense-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Request Expense Api's
export const getAllRequestExpense = async (
  search,
  pageSize,
  pageNo,
  expenseStatus,
  expenseDate
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-requested-expenses?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&expenseStatus=${
        expenseStatus || ""
      }&&expenseDate=${expenseDate || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllRequestCashExpense = async (
  search,
  pageSize,
  pageNo,
  cashRequestStatus,
  cashRequestDate
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-cash-requested-list?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${
        pageNo || ""
      }&&cashRequestStatus=${cashRequestStatus || ""}&&cashRequestDate=${
        cashRequestDate || ""
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
export const postApproveRejectExpense = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/approve-reject-expense-details`,
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
export const postApproveRejectRequest = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-cash-request-status`,
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

// All Site Items/Goods Api's
export const getAllSiteItemsGoods = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-request-item-list?search=${
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
export const postSiteItemsGoods = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/request-item`,
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
export const updateSiteItemsGoods = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-requested-item-details`,
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
export const getSingleSiteItemsGoodsById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-request-item-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const deleteSiteItemsGoodsById = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-request-item/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postApproveRejectSiteItemsGoodsRequest = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-requested-item-status`,
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
export const getAllApprovedSiteItemsGoods = async (
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-approved-items-request-list?search=${
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
export const getAllRejectedSiteItemsGoods = async (
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-rejected-items-request-list?search=${
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

// complaints filter api's

export const getAllCompanyfilterInMeasurement = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-companies-in-billing?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllOrderByIdNew = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-order-by-id-new?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllOutletByIdNew = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-outlet-by-id-new?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllOutletByIdForOfficeInspection = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-office-outlet?status=${status ?? ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get all outlet data in site Inspection
export const getAllOutletByIdForSiteInspection = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-office-outlet?status=${status ?? ""}&&siteFor=1`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get all outlet data in site Inspection for fund
export const getAllOutletByIdForFundInSite = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-outlet-office-by-id-for-fund?status=${
        status ?? ""
      }&&siteFor=1`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get all outlet data in site Inspection for Fund
export const getAllOutletForFundInSite = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-office-outlet?status=${status ?? ""}&&siteFor=1`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

//post api for assign employee in site inspection for stock
export const postAssignEmployee = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/assign-complaints-in-site-inspection`,
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

//post api for assign employee in site inspection for fund

export const getAllRegionalByIdNew = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-regional-by-id-new?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllRegionalByIdForOffice = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-office-regional-list?status=${status ?? ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get Regional By Id For Site
export const getAllRegionalForFundInSite = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-regional-office-expense-by-id-for-fund?status=${
        status ?? ""
      }&&siteFor=1 `
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get Regional By Id For Site for fund
export const getAllRegionalByIdForSite = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-office-regional-list?status=${
        status ?? ""
      }&&siteFor=1 `
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get Regional By Id For Site for fund
export const getAllRegionalByIdForFundInSite = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-regional-office-expense-by-id-for-fund?status=${
        status ?? ""
      }&&siteFor=1 `
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllSalesByIdNew = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-sales-by-id-new?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// get All All Complaint list in performa invoice based on ro
export const getAllcomplaint = async (status, ro_id, po_id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-ro-based-on-complaint?status=${
        status || ""
      }&&ro_id=${ro_id || ""}&&po_id=${po_id || ""} `
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get All All Complaint list in performa invoice based on ro
export const getAllcomplaintInvoice = async (status, ro_id, po_id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-bill-number-from-proforma?status=${
        status || ""
      }&&ro_id=${ro_id || ""}&&po_id=${po_id || ""} `
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get all sales area for office inspection
export const getAllSalesByIdForOfficeInspection = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-office-sales-area?status=${status}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get all sales area for Site inspection
export const getAllSalesByIdForSiteInspection = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-office-sales-area?status=${status ?? ""}&&siteFor=1`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get all sales area for Site inspection
export const getAllSalesForFundInSite = async (status) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-sales-area-office-by-id-for-fund?status=${
        status ?? ""
      }&&siteFor=1`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getSupplierHistoryOfToday = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-today-history-by-supplier/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAreaManagerSupervisor = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-user-to-supervisor-or-manager/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllComplaintType = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-complaint-types`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
