import axios from "axios";
import { QUERY_PARAMS } from "../utils/helper";

export const customApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

customApi.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("cms-sa-token");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export const adminLogin = async (values) => {
  try {
    const { data } = await customApi.post(`/api/super-admin/login`, values);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const adminProfile = async (values) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/profile/get-profile`,
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
export const adminProfileUpdate = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/profile/profile-update`,
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
export const adminChangePassword = async (values) => {
  try {
    const { data } = await customApi.put(
      // `/api/super-admin/change-password`,
      `/api/super-admin/profile/change-password`,
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

// API For COMPANY MODULE

// Cities By COMPANY
export const getAllCitiesByCompany = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/company/get-cities-based-on-company?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// MY COMPANY
export const addAdminMyCompanies = async (values, module) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/company/${module}/create-company`,
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

export const getAdminMyCompanies = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/company/my-company/get-my-company-list?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAdminSingleMyCompanies = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/company/my-company/get-my-company-single-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateAdminMyCompanies = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/company/my-company/update-my-company-details`,
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

export const deleteAdminCompanies = async (id, module) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/company/${module}/delete-my-company/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// PREVIOUS API
export const getAdminCompanyTypes = async () => {
  try {
    const { data } = await customApi.get("/api/super-admin/get-company-types");
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

//  CLIENT COMPANY

export const getAdminSaleCompanies = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/company/client/all-sale-companies?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAdminSingleSaleCompanies = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/company/client/get-sale-company/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateAdminSaleCompanies = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/company/client/update-sale-company`,
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

// VENDOR COMPANY

export const getAdminPurchaseCompanies = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/company/vendor/all-purchase-companies?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAdminSinglePurchaseCompanies = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/company/vendor/get-purchase-company/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateAdminPurchaseCompanies = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/company/vendor/update-purchase-company`,
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

// ALL COMPANY

export const getAdminAllCompanies = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/company/all-company/get-all-companies?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllCompaniesForChart = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/company/all-company/get-all-companies-for-chart?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAdminAllCompaniesData = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/company/all-company/get-company-details-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateAdminAllCompanies = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/company/all-company/update-all-company-details`,
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

// Only Master Data Api
// -------------------// Only Zones //--------------- //
// Fatch zone
export const getAdminZone = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/zone/all-zone?search=${search || ""}&&pageSize=${
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
export const getSingleZones = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/zone/all-zone/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Fatch zone By Energy Id
export const getZoneByEnergyId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-energy-company-zones/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Delete zone
export const deleteAdminZone = async (id, params) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/zone/delete-zone/${id}`,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Add zones
export const addAdminZone = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/zone/create-zone`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// update zones
export const updateAdminZone = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/zone/update-zone`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only RegionalOffices //--------------- //
// Fatch RegionalOffices
export const getAdminRegionalOffices = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/regional-office/all-regional-offices?search=${
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
export const getAdminAllRegionalOffices = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/regional-office/all-regional-offices`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Single RegionalOffices
export const getAdminSingleRegionalOffices = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/regional-office/get-regional-office/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Delete RegionalOffices
export const deleteAdminRO = async (id, params) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/regional-office/delete-regional-office/${id}`,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Add RegionalOffices
export const addAdminRO = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/regional-office/create-regional-office`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// update RegionalOffices
export const updateAdminRO = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/regional-office/update-regional-office`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only SalesArea //--------------- //
// All SalesArea
export const getAdminSalesArea = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/sales-area/sales-area?search=${
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
export const getSingleSalesArea = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/sales-area/sales-area-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Delete SalesArea
export const deleteAdminSalesArea = async (id, params) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/sales-area/delete-sales-area/${id}`,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Create SalesArea
export const addAdminSalesArea = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/sales-area/add-sales-area`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// update SalesArea
export const updateAdminSalesArea = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/sales-area/update-sales-area`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Get RoOnZoneId
export const getRoOnZoneId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-regional-office-on-zone-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only District //--------------- //
// All District
export const getAdminDistrict = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/district/all-districts?search=${
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
export const getSingleDistrictById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/district/get-district/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Delete District
export const deleteAdminDistrict = async (id, params) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/district/delete-district/${id}`,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Create District
export const addAdminDistrict = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/district/add-district`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// update District
export const updateAdminDistrict = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/district/update-district`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Get SalesOnRoId
export const getSalesOnRoId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-sales-area-on-ro-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Outlet //--------------- //
// All Outlet
export const getAdminOutlet = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/outlets/all-outlets?search=${search || ""}&&pageSize=${
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
// Single Outlet
export const getOutletById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/outlets/get-outlet/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Delete Outlet
export const deleteAdminOutlet = async (id, params) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/outlets/delete-outlet/${id}`,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Create Outlet
export const addAdminOutlet = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/outlets/add-outlet`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// update Outlet
export const updateAdminOutlet = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/outlets/update-outlet/`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Get Energy Company Assign Zone
export const getAdminEnergyCompanyassignZone = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-energy-company-assign-zones/${id}`
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
export const getAllEneryComnies = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-active-energy-companies`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllZoneByEnergyCompany = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/oil-and-gas/get-zones-of-energy-company-users?id=${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllRegionalByEnergyCompany = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/oil-and-gas/get-regional-office-of-energy-company-users?id=${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllSalesAreaByEnergyCompany = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/oil-and-gas/get-sales-area-of-energy-company-users?id=${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllDistrictByEnergyCompany = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/oil-and-gas/get-district-of-energy-company-users?id=${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

//API'S FOR OUTLET BY FUEL STATION
export const getAllZoneByOutlet = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/outlets/get-all-zone-for-outlets?id=${id}`
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
      `/api/super-admin/outlets/get-all-regional-office-for-outlets?id=${id}&zone_id=${zone_id}`
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
      `/api/super-admin/outlets/get-all-sales-area-for-outlets?id=${id}&zone_id=${zone_id}&regional_office_id=${regional_office_id}`
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
      `/api/super-admin/outlets/get-all-district-for-outlets?id=${id}&zone_id=${zone_id}&regional_office_id=${regional_office_id}&sales_area_id=${sales_area_id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// API'S FOR SURVEY MODULE
export const getAdminCreateSurvey = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/survey/create-survey`,
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

export const getAllRequestedSurvey = async (
  search,
  pageSize,
  pageNo,
  status
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/survey/get-requested-survey?status=${
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

export const getAllAssignSurvey = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/survey/get-assign-survey?search=${
        search || ""
      }&& pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAllResponseInSurvey = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/survey/get-survey-response`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getSingleResponseSurvey = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/survey/get-survey-response/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAdminAllSurvey = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/survey/get-all-surveys?search=${
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

export const PostApprovedRejectSurvey = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/survey/changed-survey-status`,
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

export const PostAssignSurvey = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/survey/assign-survey`,
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

export const getAdminSingleSurvey = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/survey/get-survey-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// Get Energy Company Assign Zone
export const getAdminDistrictOnSaId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/district/get-all-district-on-sale-area-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Dealers //--------------- //
// All Dealers
export const getAdminDealers = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-dealers-and-users?search=${
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
// Single Dealers Users
export const getAdminSingleDealers = async (id, type) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-dealers-and-users-details/${id}/${type}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// update Dealers
export const updateAdminDealers = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-dealers-and-users-details`,
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
// Create Dealers
export const addAdminDealers = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/create-dealer-account`,
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
// Create Users
export const addUserDealers = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/create-dealer-users`,
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
// Delete Dealers
export const deleteAdminDealers = async (id, type) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/delete-dealer-and-user/${id}/${type}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Contractors //--------------- //
// All Contractors
export const getAdminContractors = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/contractor/get-all-contractors-and-users?search=${
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
// Single Contractors Users
export const getAdminSingleContractors = async (id, type) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/contractor/get-contractors-and-users-details/${id}/${type}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// update Contractors
export const updateAdminContractors = async (values, params) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/contractor/update-contractor-details`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Create Contractors
export const addAdminContractors = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/contractor/create-contractor`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Create Users
export const addUserContractors = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/contractor/create-contractor-users`,
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
// Delete Contractors
export const deleteAdminContractors = async (id, type, params) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/contractor/delete-contractors-and-users/${id}/${type}`,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only ComplaintTypes //--------------- //
// All New ComplaintTypes
export const getAdminAllNewComplaint = async (
  search,
  pageSize,
  pageNo,
  values
) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/complaints/all-new-complains?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`,
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
// All Pending ComplaintTypes
export const getAdminAllPendingComplaint = async (
  search,
  pageSize,
  pageNo,
  values
) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/complaints/all-pending-complains?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`,
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
// All Approved ComplaintTypes
export const getAdminAllApprovedComplaint = async (
  search,
  pageSize,
  pageNo,
  values
) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/complaints/all-approved-complains?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`,
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
// All Rejected ComplaintTypes
export const getAdminAllRejectedComplaint = async (
  search,
  pageSize,
  pageNo,
  values
) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/complaints/all-rejected-complains?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`,
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
// All Resolved ComplaintTypes
export const getAdminAllResolvedComplaint = async (
  search,
  pageSize,
  pageNo,
  values
) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/complaints/all-resolved-complains?search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}`,
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
export const getApprovedComplaintsDetailsById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-approved-complaints-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Manager-List  Api's
export const getManagerListWithTotalFreeUser = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-manager-list-with-total-free-end-users?complaintId=${
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

export const postAssignComplaintToUser = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/assign-complaint-to-user`,
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
    const { data } = await customApi.post(
      `/api/super-admin/update-assign-complaint-to-user`,
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

// Post ComplaintTypes
export const PostComplaintFilter = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/complaints/complaint-flitter`,
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

// Create ComplaintTypes
export const addComplaintType = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/create-complaint-type`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Update ComplaintTypes
export const updateComplaintType = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-complaint-type`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Single ComplaintTypes
export const getAdminSingleComplaintTypes = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-complaint-type/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All TypesComplaint
export const getAdminAllTypesComplaint = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/complaint-subtype/get-all-complaints-sub-types?search=${
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

// Create TypesComplaint
export const getAdminCreateTypesComplaint = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/complaint-subtype/create-complaint-sub-type`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Update TypesComplaint
export const getAdminUpdateTypesComplaint = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/complaint-subtype/update-complaint-sub-types-details`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get single TypesComplaint
export const getSingleComplaintTypeById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/complaint-subtype/get-single-complaint-sub-type/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Approvel Member List
export const getApprovelMemberList = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/complaints/get-approvel-member-list`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getApprovelDataList = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/complaints/not-approval-set-complaint?search=${
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

export const postApprovelMemberList = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/complaints/set-complaint-approval`,
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

// -------------------// Only Energy //--------------- //
// All Energy
export const getAdminAllEnergy = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-energy-company`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S FOR EARTHING TESTING
export const PostAssignEarthingTesting = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/earthing-testing/assign-earthing-testing`,
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

// All Energy Check Related
export const getEnergyCheckRelated = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/energy-company/check-related-data-for-energy-company/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Energy Delete Related
export const getEnergyDeleteRelated = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/energy-company/delete-related-data-for-energy-company`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Get Outlet by Energy Company Id
export const getOutletbyEnergyCompanyId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/outlets/get-outlet-by-energy-company-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Create Energy
export const addAdminEnergy = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/energy-company/create-energy-company`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// update Energy
export const updateAdminEnergy = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-energy-company-details`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// single Energy Details
export const getAdminSingleEnergy = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/energy-company/get-energy-company-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Delete Energy
export const deleteAdminEnergy = async (id, sdata) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/energy-company/energy-company-delete/${id}`,
      sdata
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Companies //--------------- //
// Delete SaleCompanies
export const deleteAdminSaleCompanies = async (id) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/delete-sale-company/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Tutorials //--------------- //
// All Tutorials
export const getAdminTutorials = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-tutorials?search=${search || ""}&&pageSize=${
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

// get admin tutorial type
export const getAdminTutorialType = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/tutorials/get-tutorial-formats`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Create Tutorials
export const getAdminCreateTutorials = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/create-tutorial`,
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

// Update Tutorials
export const getAdminUpdateTutorials = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-tutorial-details`,
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

// single Tutorials Details
export const getAdminSingleTutorials = async (type) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/tutorials/get-tutorial-by-id/${type}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Module
export const getAdminAllModule = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/roles-permission/get-all-module`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Delete Tutorials
export const getAdminDeleteTutorials = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/delete-tutorial/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllAreaManagerName = async (isDropdown) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/hr-teams/get-all-admin-hr-teams?isDropdown=${
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

export const getAllEndUserBySupervisorId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-end-users-by-supervisor/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
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
      `/api/super-admin/get-all-supervisor-by-manager-with-count-free-end-users/${id}?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAdminUserListToAddTeams = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/hr-teams/get-admin-users-list-without-team`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// all team managers
export const getAdminAllHRTeamManagers = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-managers-users?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getUsersListWithOutTeams = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-users-list-without-team`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All LeavesType
export const getAdminAllLeavesType = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/hr-leave-type/get-all-leave-type?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All import Employee Data
export const importEmployeeData = async (id, values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/import-user-data/${id}`,
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

// Create LeavesType
export const getAdminCreateLeavesType = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/create-leave-type`,
      values,
      {
        params: params,
      }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Update LeavesType
export const getAdminUpdateLeavesType = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-leave-type-details`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get single leave type
export const getSingleLeaveTypeById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/hr-leave-type/get-leave-type-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Delete LeavesType
export const getAdminDeleteLeavesType = async (id, params) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/delete-leave-type/${id}`,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// change Status
export const fileteredEmployeeTask = async (id, project, status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-employee-assign-tasks?id=${id}&&${
        project !== undefined
          ? `project=${project}`
          : status !== undefined
          ? `status=${status}`
          : `project=${project}`
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

// view single Users
export const viewSingleUsers = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/hr-attendance/get-admin-user-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const viewSingleCalendarView = async (id, date) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-single-user-attendance-in-calendar-view/${id}?yearMonth=${date}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// view single employee Attendance chart
export const getAttendanceChartData = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-user-attendance-in-chart/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// view single employee Attendance Chart
export const viewSingleEmployeeChart = async (id, date) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-user-attendance-in-chart/${id}?date=${date}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// view single employee Task
export const viewSingleEmployeeTask = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-employee-assign-tasks?id=${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// view single employee Documents
export const viewSingleEmployeeDocuments = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-employee-documents/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// view single employee Credentials
export const viewSingleEmployeeCredentials = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-login-credentials/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// view single employee Credentials via email
export const viewCredentialsViaEmail = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/send-login-credentials-via-email`,
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

// view single employee Credentials via Whatsapp
export const viewCredentialsViaWhatsapp = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/send-login-credentials-via-whatsapp/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// view single employee leave
export const viewSingleEmployeeLeave = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-single-leave-application-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Hr -> Only Insurance Company
export const getAllInsuranceCompany = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-insurance-company-list`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const CreateInsuranceCompany = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/register-insurance-company`,
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

export const UpdateInsuranceCompany = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-insurance-company-details`,
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

export const DeleteInsuranceCompany = async (id) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/delete-insurance-company/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Hr -> Only Insurance Company Plans
export const getAllInsuranceCompanyPlans = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-insurance-plan-list`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllDetailsInsuranceCompanyPlans = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-single-insurance-plan-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const CreateInsuranceCompanyPlans = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/register-insurance-company-plans`,
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

export const UpdateInsuranceCompanyPlans = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-insurance-plan-details`,
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

export const DeleteInsuranceCompanyPlans = async (id) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/delete-insurance-plan-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllDetailsGroupInsurance = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-plans-of-insurance-company/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Hr -> Only Messages
export const getAllMessages = async () => {
  try {
    const { data } = await customApi.get(`/api/super-admin/get-messages`);
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
      `/api/super-admin/get-single-sender-messages/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getNewUserChat = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/add-new-user-to-chat`
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
      `/api/super-admin/start-chat-to-new-user/${id}`
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
      `/api/super-admin/sender-messages-mark-read/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getNewMessages = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-total-unread-messages`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Mark as Read Messages
export const getAdminMarkasReadMessages = async () => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/mark-all-messages-read`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleDetailsEmployeePromotionDemotion = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/single-employee-promotion-demotion-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Hr -> Only Resignations
export const CreateResignations = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/sub-user/register-employee-resignation`,
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

export const getSinglePensionRetirment = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-single-registered-pension-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Roles  //--------------- //
// All Roles
export const getAdminAllRoles = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/roles-permission/roles?search=${
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

export const getAllRolesForDropDown = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-roles-for-dropdown`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Create Roles
export const postAdminCreateRoles = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/roles-permission/create-role`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Update Roles
export const getAdminUpdateRoles = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/roles-permission/update-role`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Single Roles Details
export const getAdminSingleRoles = async (type) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/roles-permission/roles/${type}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Delete Roles
export const getAdminDeleteRoles = async (id, params) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/roles-permission/delete-role/${id}`,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Software Activation  //--------------- //
// All Software Activation
export const getAdminAllSoftwareActivation = async (
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/pending-software-activation-request?search=${
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

// Single Software Activation Details
export const getAdminSingleSoftwareActivation = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/view-pending-request-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// AllApproved Software Activation
export const getAdminApprovedSoftwareActivation = async (id, values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/approved-software-activation-request/${id}`,
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

// AllRejected Software Activation
export const getAdminRejectedSoftwareActivation = async (id, values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/rejected-software-activation-request/${id}`,
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

// AllApproved Software Activation
export const getAdminAllApprovedSoftwareActivation = async (
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-approved-software-activation-requests?search=${
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

// AllRejected Software Activation
export const getAdminAllRejectedSoftwareActivation = async (
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-rejected-software-activation-requests?search=${
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

// Delete Software Activation
export const getAdminDeleteSoftwareActivation = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/delete-software-activation-request/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Notifications  //--------------- //
// All Notifications
export const getAdminAllNotifications = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-notifications?search=${
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

// Count Notifications
export const getAdminCountNotifications = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/count-logged-user-unread-notifications`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Mark as Read Notifications
export const getAdminMarkasReadNotifications = async () => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/mark-as-read-notifications`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Task Manager  //--------------- //
// All Task Status For Dashboard
export const getAdminAllTaskDashboard = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-task-status-for-dashboard`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Task Manager Lists
export const getAdminAllTasklist = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-task-lists?search=${search || ""}&&pageSize=${
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

// Create Task Manager
export const getAdminCreateTask = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/create-task`,
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

// All Task By Status
export const getAdminAllTaskByStatus = async (types) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-task-by-status?status=${types}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Update Task Manager
export const getAdminUpdateTask = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-task-list`,
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

// Update Task Status
export const getAdminTaskStatus = async (task_id, status) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-main-task-status`,
      { task_id, status }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Delete Task Manager
export const getAdminDeleteTask = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/delete-task/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Task Manager category
export const getAdminAllTaskCategory = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-task-category?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// single task category
export const getSingleTaskCategoryById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-single-task-category/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Create Task Manager Category
export const getAdminCreateTaskCategory = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/create-task-category`,
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

// Update Task Manager Category
export const getAdminUpdateTaskCategory = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-task-category`,
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

// Delete Task Manager Category
export const getAdminDeleteCategory = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/delete-task-category/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Task Manager Comment
export const getAdminAllTaskComment = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-task-single-list/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Create Task Manager Comment
export const getAdminCreateTaskComment = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/add-task-comment`,
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

// Update Task Manager Comment
export const getAdminUpdateTaskComment = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-task-comment`,
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

// -------------------// Only Plan Pricing  //--------------- //
// All Plan Pricing
export const getAdminAllPlanPricing = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/plan/get-all-plans?search=${search || ""}&&pageSize=${
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

// Single Plan Pricing
export const getAdminSinglePlanPricing = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/plan/get-plan-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Create Plan Pricing
export const getAdminCreatePlanPricing = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/plan/create-plan`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Update Plan Pricing
export const getAdminUpdatePlanPricing = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/plan/update-plan-details`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Delete Plan Pricing
export const getAdminDeletePlanPricing = async (id, params) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/plan/delete-plan/${id}`,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Contacts  //--------------- //
// All Contractors Contacts
export const getAdminAllContractorsContacts = async (
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/contacts/get-all-pending-account-status-contractors-and-users?search=${
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

// Update Contractors Contacts
export const getAdminUpdateContractorsContacts = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/contacts/contractors-and-users-set-account-status`,
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

// All Energy Contacts
export const getAdminAllEnergyContacts = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/contacts/get-all-pending-account-status-of-energy-company-and-users?search=${
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

// Update Energy Contacts
export const getAdminUpdateEnergyContacts = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/contacts/update-account-status-of-energy-company-and-users`,
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

// All Dealer Contacts
export const getAdminAllDealerContacts = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/contacts/get-all-pending-account-status-of-dealers-and-users-details?search=${
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

// Update Dealer Contacts
export const getAdminUpdateInDealerContacts = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/contacts/update-account-status-of-dealers-and-users`,
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

// Update Dealer Contacts
export const getAdminUpdateDealerContacts = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/contacts/update-account-status-of-admins-and-users`,
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

// All SuperAdmin Contacts
export const getAdminAllSuperAdminContacts = async (
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/contacts/get-all-pending-account-status-of-admins-and-users-details?search=${
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

// Update SuperAdmin Contacts
export const getAdminUpdateSuperAdminContacts = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-account-status-of-admins-and-users`,
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

// -------------------// Only Term Conditions  //--------------- //
// All Term Conditions
export const getAdminAllTermConditions = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-created-terms-and-conditions?search=${
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

// Create Term Conditions
export const getAdminCreateTermConditions = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/create-terms-and-conditions`,
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

// Single Term Conditions
export const getAdminSingleTermConditions = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-single-created-terms-and-conditions-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Update Term Conditions
export const getAdminUpdateTermConditions = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-terms-and-conditions-details`,
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

// Delete Term Conditions
export const getAdminDeleteTermConditions = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/delete-terms-and-conditions-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleDocumentById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-document-category-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Users by Role
export const getAdminUsersbyRole = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-users-by-role/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllUsers = async () => {
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

// ALL USER
export const getAllUsersInEmployee = async (role_id, params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-users/${role_id}?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Document List
export const getAdminAllDocumentList = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-document?search=${search || ""}&&pageSize=${
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

// View Document List
export const getAdminViewDocumentList = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/view-document/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Single Document List
export const getAdminSingleDocumentList = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-document-on-category-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Otp Survey
export const postOtpSurvey = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/surveys-otp-send`,
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

// All Otp verify Survey
export const postOtpVerifySurvey = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/surveys-otp-verify`,
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

// All Submit Questions Survey
export const postQuestionsSurvey = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/submit-survey-question-response`,
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

// All Response Survey
export const getAllResponseSurvey = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-survey-response?search=${
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

export const getSingleSurveyPurposeMasterById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-single-purpose-master/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

//------------------ Dashboard  clock in -clock out ---------------//
// clock-in
export const updateClockIn = async () => {
  try {
    const { data } = await customApi.post(`/api/super-admin/clock-in`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// clock-out
export const updateClockOut = async () => {
  try {
    const { data } = await customApi.post(`/api/super-admin/clock-out`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Update Survey
export const getAdminUpdateSurvey = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-survey-details`,
      values,
      { params: params }
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const AdminSingleSurveyItemMasterById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/item-master/get-item-master-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postCheckItemUniqueIdExists = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/check-item-unique-id-exists`,
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

// Break start
export const updateBreakStart = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/mark-break`,
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

export const createResponseSurvey = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/send-survey-response`,
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

// Break End
export const updateBreakEnd = async (values) => {
  try {
    const { data } = await customApi.post(`/api/super-admin/break-end`, values);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Survey Item Master  //--------------- //
// All Survey Item Master
export const getAdminAllSurveyItemMaster = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-item-masters?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// upload Import Items
export const uploadImportItems = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/item-master/import-item-master`,
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

// Create Survey Item Master
export const AdminCreateSurveyItemMaster = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/create-item-master`,
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

// Update Survey Item Master
export const AdminUpdateSurveyItemMaster = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-item-master-details`,
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

// Delete Survey Item Master
export const AdminDeleteSurveyItemMaster = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/delete-item-master/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// get Total Hours
export const getTotalHours = async () => {
  try {
    const { data } = await customApi.get(
      "/api/super-admin/get-total-month-work-hours"
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Survey Purpose Master  //--------------- //
// All Survey Purpose Master
export const getAdminAllSurveyPurposeMaster = async (
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-all-purpose-master?search=${
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

// Create Survey Purpose Master
export const AdminCreateSurveyPurposeMaster = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/create-purpose-master`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Update Survey Purpose Master
export const AdminUpdateSurveyPurposeMaster = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-purpose-master`,
      values,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Delete Survey Purpose Master
export const AdminDeleteSurveyPurposeMaster = async (id, params) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/delete-purpose-master/${id}`,
      { params: params }
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Enable Disable Features  //--------------- //
// All Enable Disable Features
export const getAdminAllEnableDisable = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/roles-permission/get-all-module`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllModule = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/roles-permission/get-all-module`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// // Super Admin Employees
// export const getAllModuleForSuperAdminUser = async (id) => {
//   try {
//     const { data } = await customApi.get(
//       `/api/super-admin/roles-permission/get-all-module/${id}`
//     );
//     return data;
//   } catch (error) {
//     return {
//       status: false,
//       message: error.response.data.message || error.message,
//     };
//   }
// };

export const getAllModuleByRoleId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/roles-permission/get-all-module/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllModuleByPlanId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/plan/get-all-module/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Create Enable Disable Features
export const AdminCreateEnableDisable = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/set-permission-on-role-basis`,
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

// Create Roles & Permissions
export const AdminCreateRolesPermissions = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/set-permission-on-role`,
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

export const postRolesPermissions = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/roles-permission/set-permission`,
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

// Update Enable Disable Features
export const AdminUpdateEnableDisable = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-permissions-on-role-basis`,
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

// Enable Disable Features Users by Role
export const getAdminEnableDisablebyRole = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-admins-by-role/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Enable Disable Features Users by Admin
export const getAdminEnableDisablebyAdmin = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-users-by-admin-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Suggestions Feedbacks  //--------------- //
// All Suggestions Feedbacks
export const getAdminAllSuggestionsFeedbacks = async (
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/feedback-and-suggestions?search=${
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

//get admin time-card
// All Users Attendance in Calendar View Api's
export const getAllUsersAttendanceInCalendar = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-users-attendance-in-calendar-view?${queryParams}`
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
    const { data } = await customApi.post(
      `/api/super-admin/mark-manual-attendance`,
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
      `/api/super-admin/hr-attendance/mark-attendance-in-bulk`,
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

export const getAllEnergyCompanyOnly = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/energy-company/get-all-energy-company-with-soft-delete?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleComplaint = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-complaints-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Get Officers List On Ro
export const getOfficersListOnRo = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-officers-list-on-ro/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// all zones for dropdown
export const getAllZonesForDropdown = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/zone/all-active-zone`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleCompanyDetails = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-company-details-by-company-id/${id}`
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

// Crud Order Via
export const getAllOrderVia = async () => {
  try {
    const { data } = await customApi.get(`/api/super-admin/get-all-order`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllAreaNameByAreaId = async (energy_company_id, type) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/get-area-data-for-energy/${energy_company_id}/${type}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postZoneUser = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/energy-company/create-zone-user`,
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

// -------------------// Only Item Master  //--------------- //
export const approveRejectFundtemById = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.post(
      `/api/super-admin/change-status-for-item-master?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S FOR HR MODULE
//  TEAMS
export const addHrTeam = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/hr-teams/create-admin-team`,
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

export const getAdminAllHRTeams = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/hr-teams/get-all-teams?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAdminSingleHRTeams = async (id, search) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/hr-teams/get-team-details-by-id/${id}?search=${
        search || ""
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

export const getAdminUserListWithoutTeam = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/hr-teams/get-admin-users-list-without-team`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const deleteTeam = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/hr-teams/delete-team/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateHrTeam = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/hr-teams/update-team-details`,
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

export const postAdminUserListToAddTeams = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/hr-teams/add-specific-admin-user-to-team`,
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

export const deleteAdminSingleHRTeams = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/hr-teams/remove-specific-admin-user-from-team`,
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

// EMPLOYEES
export const addEmplyee = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/hr-employees/create-admin-user`,
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

export const getHRTeamsEmployee = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/hr-teams/get-all-admin-hr-teams?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAdminAllHREmployees = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/hr-employees/get-all-admin-employees?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const viewSingleEmployee = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/hr-employees/get-single-admin-employee-detail/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const changeEmployeeStatus = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/hr-employees/update-admin-user-status`,
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

export const updateEmployee = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/hr-employees/update-admin-user`,
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

export const deleteEmployee = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/hr-employees/delete-admin-employee/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// ATTENDANCE
export const getAdminAllTimeCard = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/hr-attendance/get-all-user-time-sheet?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const viewSingleEmployeeAttendance = async (id, date) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/hr-attendance/get-user-time-sheet/${id}?date=${date}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getDashboardData = async () => {
  try {
    const { data } = await customApi.get(
      "/api/super-admin/hr-attendance/get-today-mark-login-and-break"
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAdminCreateMarkManually = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/hr-attendance/mark-manually-attendance-for-user`,
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

export const getAdminTodayClockIn = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/hr-attendance/get-all-user-today-clock-in`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAdminTodayClockOut = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/hr-attendance/get-all-user-today-clock-out`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAdminChangeClockTime = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/hr-attendance/change-user-attendance-status-by-super-admin`,
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

//  LEAVE
export const getsingleAppliedLeaves = async (id, status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/hr-leaves/all-apply-leave/${id}?status=${status || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllAppliedLeaves = async (search, pageSize, pageNo, status) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/hr-leaves/all-apply-leave?search=${
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

export const approvedLeaveRequest = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/hr-leaves/leave-application-status-update`,
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

export const assignLeave = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/hr-leaves/apply-leave`,
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

//  PAYROLL
export const getAllowancesPayroll = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/get-payroll/get-all-allowances?search=${
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

export const getDeductionsPayroll = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/get-payroll/get-all-deductions?search=${
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

// PAYROLL MASTER
export const CreatePayrollMaster = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payroll/payroll-master/create-new-payroll-settings`,
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

export const getSinglePayrollMasterById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/payroll-master/get-all-payroll-master-settings/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllPayrollMaster = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/payroll-master/get-all-payroll-master-settings`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const UpdatePayrollMaster = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payroll/payroll-master/update-payroll-master-settings`,
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

export const UpdatePayrollMasterSetting = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payroll/payroll-master/update-payroll-master-settings-label`,
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

export const CreateAllowances = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payroll/payroll-master/create-allowances`,
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

export const CreateDeductions = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payroll/payroll-master/create-deductions`,
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

// GROUP INSURANCE
export const getAllGroupInsurance = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/group-insurance/get-group-insurance-list?search=${
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

export const CreateGroupInsurance = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payroll/group-insurance/create-group-insurance`,
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

export const getSingleDetailsGroupInsurance = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/group-insurance/get-group-insurance-single-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const UpdateGroupInsurance = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payroll/group-insurance/update-group-insurance-details`,
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

export const DeleteGroupInsurance = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/payroll/group-insurance/delete-group-insurance-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// SALARY DISBURSAL
export const getAllSalaryDisbursal = async (
  month,
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/salary-disbursal/get-salary-disbursal?month=${month}&&search=${
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

export const getSingleSalaryDisbursal = async (id, month) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/salary-disbursal/get-salary-disbursal-details?id=${id}&&month=${month}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const CreateSalaryDisbursal = async (values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/mark-salary-disbursed`,
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

// LOAN
export const getCreateLoans = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payroll/loan/create-loans`,
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

export const getAllPendingLoans = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/payroll/loan/get-all-loans-pending?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllActiveLoans = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/payroll/loan/get-all-loans-active?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllRejectedLoans = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/payroll/loan/get-all-loans-reject?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllClosedLoans = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/payroll/loan/get-all-loans-closed?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleLoanById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/loan/get-loan-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getUpdateLoans = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payroll/loan/update-loan-details`,
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

export const ChangedLoanStatus = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payroll/loan/changed-loan-status`,
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

// PAY SLIP
export const getAllPaySlip = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/payroll/pay-slip/get-users-pay-slip?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getViewPaySlip = async (id, month) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/pay-slip/get-user-pay-slip-details?id=${id}&&month=${month}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// EMPLOYEE PROMOTION DEMOTION
export const CreateEmployeePromotionDemotion = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payroll/promotion-demotion/employee-promotion-demotion-add`,
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

export const getAllEmployeePromotionDemotion = async (
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/promotion-demotion/employee-promotion-demotion-get-all-list?search=${
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

export const UpdateEmployeePromotionDemotion = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payroll/promotion-demotion/update-employee-promotion-demotion-details`,
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

// RESIGNATION
export const getAllResignationsPendingRequest = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/payroll/resignation/get-resignations-pending-request?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllResignationsApprovedRequest = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/payroll/resignation/get-resignations-approved-list?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllResignationsRejectedRequest = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/payroll/resignation/get-resignations-rejected-list?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllGeneratedFNF = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/payroll/resignation/get-fnf-statements?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleEmployeeResignationById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/resignation/get-single-resignation-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const UpdateResignations = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payroll/resignation/update-resignations-details`,
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

export const UpdateResignationsRequest = async (id, values) => {
  try {
    const { data } = await customApi.put(
      `/api/super-admin/payroll/resignation/update-resignations-request-by-admin/${id}/${values}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// RETIREMENT
export const CreatePensionRetirment = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payroll/pension/register-employee-pension`,
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

export const getAllPensionRetirment = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/pension/get-all-registered-pension-list?search=${
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

export const UpdatePensionRetirment = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/payroll/pension/update-registered-pension`,
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

export const DeletePensionRetirment = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/payroll/pension/delete-register-employee-pension/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// EMPLOYEE TRACKING
export const getEmployeeTracking = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/employee-tracking/get-employee-history-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// EMPLOYEE LOGS
export const getAllEmployeeLogs = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/employee-logs/get-all-activity-logs?search=${
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

export const getSingleEmployeeLogs = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/payroll/employee-logs/get-single-activity-logs/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// DOCUMENTS
export const getAdminCreateDocument = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/documents/document-category/create-document-category`,
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

export const getAdminAllDocument = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/documents/document-category/get-all-document-categories?search=${
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

export const SearchAllDocumentList = async (search = "") => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/documents/document-category/get-all-document-categories?search=${search}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAdminUpdateDocument = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/documents/document-category/update-document-category-details`,
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

export const getAdminDeleteDocument = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/documents/document-category/delete-document-category/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAdminAddDocumentList = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/documents/add-documents`,
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

export const getAdminUpdateDocumentList = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/documents/update-document`,
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

export const getAdminDeleteDocumentList = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/documents/delete-document/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// ORDER VIA
export const postOrderVia = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/order-via/create-order`,
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

export const updateOrderVia = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/master-data/order-via/update-order`,
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

export const deleteOrderVia = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/super-admin/master-data/order-via/delete-order/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleOrderViaById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/master-data/order-via/get-order-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAllUsersCompanyWise = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/super-admin/get-all-contact-users?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
