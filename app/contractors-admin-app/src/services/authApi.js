import { customApi } from '../../config';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// export const customApi = axios.create({
//   baseURL: 'http://192.168.1.9:8080',
//   // baseURL: 'http://apicms.thewingshield.com:8020',
// });

// customApi.interceptors.request.use(async config => {
//   try {
//     let token = await AsyncStorage.getItem('cms-client-token');
//     // let token =
//     //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX3R5cGUiOjEsImlhdCI6MTcwMjAwODQ0MiwiZXhwIjoxNzA0NjAwNDQyfQ.ft7-hlRERHSfxraeKJ_a85XbZOY8NY07mfYOymJaqOM';
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   } catch (error) {
//     // Handle AsyncStorage error
//     console.error('Error reading token from AsyncStorage:', error);
//     return config;
//   }
// });

export const adminLogin = async values => {
  try {
    const { data } = await customApi.post(`/api/contractor/login`, values);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
};

export const adminProfile = async values => {
  try {
    const { data } = await customApi.get(`/api/contractor/profile`, values);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const adminProfileUpdate = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/profile-update`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const adminChangePassword = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/change-password`,
      values,
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
      `/api/contractor/all-zone?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
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
export const getZoneByEnergyId = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-energy-company-zones/${id}`,
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
export const deleteAdminZone = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-zone/${id}`,
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
export const addAdminZone = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-zone`,
      values,
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
export const updateAdminZone = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-zone`,
      values,
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
    const { data } = await customApi.get(`/api/contractor/all-active-zone`);
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
      `/api/contractor/all-regional-offices?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
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
      `/api/contractor/all-regional-offices`,
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
export const getAdminSingleRegionalOffices = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-regional-office/${id}`,
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
export const deleteAdminRO = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-regional-office/${id}`,
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
export const addAdminRO = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-regional-office`,
      values,
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
export const updateAdminRO = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-regional-office`,
      values,
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
      `/api/contractor/sales-area?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
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
export const deleteAdminSalesArea = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-sales-area/${id}`,
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
export const addAdminSalesArea = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/add-sales-area`,
      values,
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
export const updateAdminSalesArea = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-sales-area`,
      values,
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
export const getRoOnZoneId = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-regional-office-on-zone-id/${id}`,
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
      `/api/contractor/all-districts?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
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
export const deleteAdminDistrict = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-district/${id}`,
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
export const addAdminDistrict = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/add-district`,
      values,
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
export const updateAdminDistrict = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-district`,
      values,
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
export const getSalesOnRoId = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-sales-area-on-ro-id/${id}`,
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
      `/api/contractor/fuel-station/all-outlets?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
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
export const getOutletById = async id => {
  try {
    const { data } = await customApi.get(`/api/contractor/get-outlet/${id}`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Delete Outlet
export const deleteAdminOutlet = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-outlet/${id}`,
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
export const addAdminOutlet = async values => {
  try {
    const { data } = await customApi.post(`/api/contractor/add-outlet`, values);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// update Outlet
export const updateAdminOutlet = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/fuel-station/update-outlet/`,
      values,
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
export const getAdminEnergyCompanyassignZone = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-energy-company-assign-zones/${id}`,
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
export const getOtherEneryCompanies = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-company-details`,
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
export const getAllEneryComnies = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-active-energy-companies`,
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
export const getAdminDistrictOnSaId = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-district-on-sale-area-id/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getOutletByDistrictId = async (id, sale_area_id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-outlet-by-district-id/${id}?sale_area_id=${sale_area_id}`,
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
      `/api/contractor/get-all-dealers-and-users?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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
      `/api/contractor/get-dealers-and-users-details/${id}/${type}`,
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
export const updateAdminDealers = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-dealers-and-users-details`,
      values,
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
export const addAdminDealers = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-dealer-account`,
      values,
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
export const addUserDealers = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-dealer-users`,
      values,
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
      `/api/contractor/delete-dealer-and-user/${id}/${type}`,
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
      `/api/contractor/get-all-contractors-and-users?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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
      `/api/contractor/get-contractors-and-users-details/${id}/${type}`,
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
export const updateAdminContractors = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-contractor-details`,
      values,
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
export const addAdminContractors = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-contractor`,
      values,
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
export const addUserContractors = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-contractor-users`,
      values,
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
export const deleteAdminContractors = async (id, type) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/delete-contractors-and-users/${id}/${type}`,
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
  values,
) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/all-new-complains?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
      values,
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
  values,
) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/all-pending-complains?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
      values,
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
  values,
) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/all-approved-complains?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
      values,
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
  values,
) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/all-rejected-complains?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
      values,
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
  values,
) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/all-resolved-complains?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
      values,
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
export const PostComplaintFilter = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/complaint-flitter`,
      values,
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
export const addComplaintType = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/complaints/create-complaint-type`,
      values,
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
export const updateComplaintType = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/complaints/update-complaint-type`,
      values,
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
export const getAdminSingleComplaintTypes = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/complaints/get-complaint-type/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleComplaint = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/complaints/get-complaints-details/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleCompanyDetails = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-company-details-by-company-id/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getCitiesBasedOnCompany = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/company/get-cities-based-on-company?my_company=1`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getCitiesBasedOnType = async type => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/company/get-cities-based-on-company?type=${type}`,
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
      `/api/contractor/get-all-complaints-sub-types?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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
export const getAdminCreateTypesComplaint = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-complaint-sub-type`,
      values,
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
export const getAdminUpdateTypesComplaint = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-complaint-sub-types-details`,
      values,
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
      `/api/contractor/get-approvel-member-list`,
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
      `/api/contractor/not-approval-set-complaint?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postApprovelMemberList = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/set-complaint-approval`,
      values,
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
      `/api/contractor/get-all-energy-company`,
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
export const getEnergyCheckRelated = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/check-related-data-for-energy-company/${id}`,
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
export const getEnergyDeleteRelated = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/delete-related-data-for-energy-company`,
      values,
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
export const getOutletbyEnergyCompanyId = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-outlet-by-energy-company-id/${id}`,
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
export const addAdminEnergy = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-energy-company`,
      values,
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
export const updateAdminEnergy = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-energy-company-details`,
      values,
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
export const getAdminSingleEnergy = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-energy-company-details/${id}`,
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
      `/api/contractor/energy-company-delete/${id}`,
      sdata,
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
// All Companies
export const getAdminAllCompanies = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-companies?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// single All companies Details
export const getAdminAllCompaniesData = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-company-details-by-id/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// update All Companies
export const updateAdminAllCompanies = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-all-company-details`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All MyCompanies
export const getAdminMyCompanies = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-my-company-list?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// single MyCompanies Details
export const getAdminSingleMyCompanies = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor-get-my-company-single-details/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// update MyCompanies
export const updateAdminMyCompanies = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/company/my-company/update-my-company-details`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Create MyCompanies
export const addAdminMyCompanies = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-company`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Delete MyCompanies
export const deleteAdminCompanies = async id => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/delete-my-company/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Delete CompanyTypes
export const getAdminCompanyTypes = async () => {
  try {
    const { data } = await customApi.get('/api/contractor/get-company-types');
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All SaleCompanies
export const getAdminSaleCompanies = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/all-sale-companies?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// single SaleCompanies Details
export const getAdminSingleSaleCompanies = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-sale-company/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// update SaleCompanies
export const updateAdminSaleCompanies = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-sale-company`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Delete SaleCompanies
export const deleteAdminSaleCompanies = async id => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/delete-sale-company/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All PurchaseCompanies
export const getAdminPurchaseCompanies = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/all-purchase-companies?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// single PurchaseCompanies Details
export const getAdminSinglePurchaseCompanies = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-purchase-company/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// update PurchaseCompanies
export const updateAdminPurchaseCompanies = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-purchase-company`,
      values,
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
      `/api/contractor/get-all-tutorials?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
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
export const getAdminCreateTutorials = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-tutorial`,
      values,
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
export const getAdminUpdateTutorials = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-tutorial-details`,
      values,
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
export const getAdminSingleTutorials = async type => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-tutorial-details/${type}`,
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
    const { data } = await customApi.get(`/api/contractor/get-all-module`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Delete Tutorials
export const getAdminDeleteTutorials = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-tutorial/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only HR Manegment //--------------- //
// All HRTeams
export const getAdminAllHRTeams = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-hr-teams?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Add HrTeams
export const addHrTeam = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-hr-team`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// update team
export const updateHrTeam = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-hr-team-details`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Single HRTeams
export const getAdminSingleHRTeams = async (id, search) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-hr-team-detail/${id}?search=${search || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const deleteAdminSingleHRTeams = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/remove-specific-user-from-team`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminUserListToAddTeams = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-users-list-to-add-in-team/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postAdminUserListToAddTeams = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/add-specific-user-to-team`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Delete Team
export const deleteTeam = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-hr-team/${id}`,
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
export const getAdminAllHRTeamManagers = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-managers-users`,
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
      `/api/contractor/get-users-list-without-team`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Employees
export const getAdminAllHREmployees = async ({
  search,
  pageSize,
  pageNo,
  isDropdown,
}) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-employees?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}&&isDropdown=${isDropdown || ''}`,
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
export const getAdminAllLeavesType = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-leave-type?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
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
      `/api/contractor/import-user-data/${id}`,
      values,
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
export const getAdminCreateLeavesType = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-leave-type`,
      values,
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
export const getAdminUpdateLeavesType = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-leave-type-details`,
      values,
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
export const getAdminDeleteLeavesType = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-leave-type/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Create Employee
export const addEmplyee = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-user`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// update Employee
export const updateEmployee = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-user`,
      values,
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
export const changeEmployeeStatus = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-user-status`,
      values,
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
      `/api/contractor/get-employee-assign-tasks?id=${id}&&${
        project !== undefined
          ? `project=${project}`
          : status !== undefined
            ? `status=${status}`
            : `project=${project}`
      }`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// view single employee
export const viewSingleEmployee = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-employee-detail/${id}`,
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
export const viewSingleUsers = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-user-by-id/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// view single employee Attendance
export const viewSingleEmployeeAttendance = async (id, date) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-user-time-sheet/${id}?date=${date}`,
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
export const getAttendanceChartData = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-user-attendance-in-chart/${id}`,
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
      `/api/contractor/get-user-attendance-in-chart/${id}?date=${date}`,
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
export const viewSingleEmployeeTask = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-employee-assign-tasks?id=${id}`,
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
export const viewSingleEmployeeDocuments = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-employee-documents/${id}`,
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
export const viewSingleEmployeeCredentials = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-login-credentials/${id}`,
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
export const viewCredentialsViaEmail = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/send-login-credentials-via-email`,
      values,
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
export const viewCredentialsViaWhatsapp = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/send-login-credentials-via-whatsapp/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

//  delete employee
export const deleteEmployee = async id => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/delete-employee/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

//get All Applied Leaves
export const getAllAppliedLeaves = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/all-apply-leave?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
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
export const viewSingleEmployeeLeave = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-leave-application-details/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// approved leave
export const approvedLeaveRequest = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/leave-application-status-update`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Assign Leave form
export const assignLeave = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/apply-leave`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// All Attendance
export const getAdminAllTimeCard = async (StartDate, EndDate) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-user-time-sheet?start_date=${StartDate}&&end_date=${EndDate}`,
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
      `/api/contractor/get-all-user-today-clock-in`,
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
      `/api/contractor/get-all-user-today-clock-out`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Change Clock Time
export const getAdminChangeClockTime = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/change-user-attendance-status-by-super-admin`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Create Mark Manually
export const getAdminCreateMarkManually = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/mark-manually-attendance-for-user`,
      values,
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
      `/api/contractor/get-insurance-company-list`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const CreateInsuranceCompany = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/register-insurance-company`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const UpdateInsuranceCompany = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-insurance-company-details`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const DeleteInsuranceCompany = async id => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/delete-insurance-company/${id}`,
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
      `/api/contractor/get-all-insurance-plan-list`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllDetailsInsuranceCompanyPlans = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-insurance-plan-details/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const CreateInsuranceCompanyPlans = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/register-insurance-company-plans`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const UpdateInsuranceCompanyPlans = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-insurance-plan-details`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const DeleteInsuranceCompanyPlans = async id => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/delete-insurance-plan-details/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Hr -> Only Payroll Master
export const getAllPayrollMaster = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-payroll-master-settings`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const CreatePayrollMaster = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-new-payroll-settings`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const UpdatePayrollMaster = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-payroll-master-settings`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const UpdatePayrollMasterSetting = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-payroll-master-settings-label`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const CreateAllowances = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-allowances`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const CreateDeductions = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-deductions`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllowancesPayroll = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-allowances?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
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
      `/api/contractor/get-all-deductions?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Hr -> Only Group Insurance
export const getAllGroupInsurance = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-group-insurance-list?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getSingleDetailsGroupInsurance = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-group-insurance-single-details/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllDetailsGroupInsurance = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-plans-of-insurance-company/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const CreateGroupInsurance = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-group-insurance`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const UpdateGroupInsurance = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-group-insurance-details`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const DeleteGroupInsurance = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-group-insurance-details/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Hr -> Only Salary Disbursal
export const getAllSalaryDisbursal = async (
  month,
  search,
  pageSize,
  pageNo,
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-salary-disbursal?month=${month}&&search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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
      `/api/contractor/get-salary-disbursal-details?id=${id}&&month=${month}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const CreateSalaryDisbursal = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/mark-salary-disbursed`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Hr -> Only Loans
export const getAllLoans = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-loans-pending`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getCreateLoans = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-loans`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getUpdateLoans = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-loan-details`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllActiveLoans = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-loans-active`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllRejectedLoans = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-loans-reject`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllClosedLoans = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-loans-closed`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const ChangedLoanStatus = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/changed-loan-status`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Hr -> Only PaySlip
export const getAllPaySlip = async month => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-users-pay-slip?month=${month}`,
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
      `/api/contractor/get-user-pay-slip-details?id=${id}&&month=${month}`,
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
    const { data } = await customApi.get(
      `/api/contractor/communication/get-messages`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getSingleMessages = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-sender-messages/${id}`,
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
      `/api/contractor/add-new-user-to-chat`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const AddnewUsertoChat = async id => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/start-chat-to-new-user/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getMessagesMarkRead = async id => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/sender-messages-mark-read/${id}`,
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
      `/api/contractor/get-total-unread-messages`,
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
      `/api/contractor/mark-all-messages-read`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Hr -> Only Employee Promotion Demotion
export const getAllEmployeePromotionDemotion = async (
  search,
  pageSize,
  pageNo,
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/employee-promotion-demotion-get-all-list?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const CreateEmployeePromotionDemotion = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/employee-promotion-demotion-add`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getSingleDetailsEmployeePromotionDemotion = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/single-employee-promotion-demotion-details/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const UpdateEmployeePromotionDemotion = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-employee-promotion-demotion-details`,
      values,
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
export const CreateResignations = async values => {
  try {
    const { data } = await customApi.post(
      `/api/sub-user/register-employee-resignation`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const UpdateResignations = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-resignations-details`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllResignationsPendingRequest = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-resignations-pending-request`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllResignationsApprovedRequest = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-resignations-approved-list`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllResignationsRejectedRequest = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-resignations-rejected-list`,
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
    const { data } = await customApi.post(
      `/api/contractor/update-resignations-request-by-admin/${id}/${values}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllGeneratedFNF = async () => {
  try {
    const { data } = await customApi.get(`/api/contractor/get-fnf-statements`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Hr -> Only Employee Pension/retirment
export const getAllPensionRetirment = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-registered-pension-list?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getSinglePensionRetirment = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-registered-pension-details/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const CreatePensionRetirment = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/register-employee-pension`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const UpdatePensionRetirment = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-registered-pension`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const DeletePensionRetirment = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-register-employee-pension/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Hr -> Only Employee Tracking
export const getEmployeeTracking = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-employee-history-details/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Hr -> Only Employee Logs
export const getAllEmployeeLogs = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-activity-logs?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getSingleEmployeeLogs = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-activity-logs/${id}`,
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
      `/api/contractor/roles?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllRoles = async () => {
  try {
    const { data } = await customApi.get(`/api/contractor/roles-for-dropdown`);
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
      `/api/contractor/get-all-roles-for-dropdown`,
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
export const postAdminCreateRoles = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-role`,
      values,
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
export const getAdminUpdateRoles = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-role`,
      values,
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
export const getAdminDeleteRoles = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/Delete-role/${id}`,
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
  pageNo,
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/pending-software-activation-request?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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
export const getAdminSingleSoftwareActivation = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/view-pending-request-details/${id}`,
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
      `/api/contractor/approved-software-activation-request/${id}`,
      values,
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
      `/api/contractor/rejected-software-activation-request/${id}`,
      values,
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
  pageNo,
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-approved-software-activation-requests?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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
  pageNo,
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-rejected-software-activation-requests?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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
export const getAdminDeleteSoftwareActivation = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-software-activation-request/${id}`,
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
      `/api/contractor/get-all-notifications?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
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
      `/api/contractor/count-logged-user-unread-notifications`,
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
      `/api/contractor/mark-as-read-notifications`,
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
      `/api/contractor/get-task-status-for-dashboard`,
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
      `/api/contractor/task/get-task-lists?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
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
export const getAdminCreateTask = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-task`,
      values,
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
export const getAdminAllTaskByStatus = async types => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-task-by-status?status=${types}`,
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
export const getAdminUpdateTask = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-task-list`,
      values,
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
export const getAdminTaskStatus = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-main-task-status`,
      values,
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
export const getAdminDeleteTask = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-task/${id}`,
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
export const getAdminAllTaskCategory = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-task-category?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
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
export const getAdminCreateTaskCategory = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-task-category`,
      values,
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
export const getAdminUpdateTaskCategory = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-task-category`,
      values,
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
export const getAdminDeleteCategory = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-task-category/${id}`,
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
export const getAdminAllTaskComment = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-task-single-list/${id}`,
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
export const getAdminCreateTaskComment = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/add-task-comment`,
      values,
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
export const getAdminUpdateTaskComment = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-task-comment`,
      values,
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
      `/api/contractor/get-all-plans?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
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
export const getAdminSinglePlanPricing = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-plan-details/${id}`,
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
export const getAdminCreatePlanPricing = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-plan`,
      values,
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
export const getAdminUpdatePlanPricing = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-plan-details`,
      values,
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
export const getAdminDeletePlanPricing = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-plan/${id}`,
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
  pageNo,
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-pending-account-status-contractors-and-users?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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
export const getAdminUpdateContractorsContacts = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/contractors-and-users-set-account-status`,
      values,
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
      `/api/contractor/get-all-pending-account-status-of-energy-company-and-users?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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
export const getAdminUpdateEnergyContacts = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-account-status-of-energy-company-and-users`,
      values,
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
      `/api/contractor/get-all-pending-account-status-of-dealers-and-users-details?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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
export const getAdminUpdateDealerContacts = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-account-status-of-dealers-and-users`,
      values,
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
  pageNo,
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-pending-account-status-of-admins-and-users-details?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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
export const getAdminUpdateSuperAdminContacts = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-account-status-of-admins-and-users`,
      values,
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
      `/api/contractor/get-all-created-terms-and-conditions?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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
export const getAdminCreateTermConditions = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-terms-and-conditions`,
      values,
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
export const getAdminSingleTermConditions = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-created-terms-and-conditions-details/${id}`,
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
export const getAdminUpdateTermConditions = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-terms-and-conditions-details`,
      values,
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
export const getAdminDeleteTermConditions = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-terms-and-conditions-details/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Document  //--------------- //
// All Document
export const getAdminAllDocument = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/documents/document-category/get-all-document-categories?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getSingleDocumentById = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-document-category-details/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Search Document List
export const SearchAllDocumentList = async (search = '') => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/documents/document-category/get-all-document-categories?search=${search}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Create Document
export const getAdminCreateDocument = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-document-category`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Update Document
export const getAdminUpdateDocument = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-document-category-details`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Delete Document
export const getAdminDeleteDocument = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-document-category/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Add Document-List
export const getAdminAddDocumentList = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/add-documents`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Update Document-List
export const getAdminUpdateDocumentList = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-document`,
      values,
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
export const getAdminUsersbyRole = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-users-by-role/${id}`,
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
    const { data } = await customApi.get(`/api/contractor/get-all-users`);
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
      `/api/contractor/documents/document-category/get-all-document?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Delete Document List
export const getAdminDeleteDocumentList = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-document/${id}`,
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
export const getAdminViewDocumentList = async id => {
  try {
    const { data } = await customApi.get(`/api/contractor/view-document/${id}`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Single Document List
export const getAdminSingleDocumentList = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-document-on-category-id/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// -------------------// Only Survey  //--------------- //
// All Survey
export const getAdminAllSurvey = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/survey/get-all-surveys?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Post Assign Survey
export const PostAssignSurvey = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/assign-survey`,
      values,
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
export const postOtpSurvey = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/surveys-otp-send`,
      values,
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
export const postOtpVerifySurvey = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/surveys-otp-verify`,
      values,
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
export const postQuestionsSurvey = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/send-survey-response`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// All Assign Survey
export const getAllAssignSurvey = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/survey/get-assign-survey?search=${search || ''}&& pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// All Requested Survey
export const getAllRequestedSurvey = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/survey/get-requested-survey?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
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
export const getAllResponseSurvey = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/survey/get-survey-response`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// All Single Response Survey
export const getSingleResponseSurvey = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/survey/get-survey-response/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Approved/Reject Survey
export const PostApprovedRejectSurvey = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/changed-survey-status`,
      values,
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
    const { data } = await customApi.post(`/api/contractor/clock-in`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Create Survey
// export const getAdminCreateSurvey = async (sData) => {
//   try {
//     const cache = [];
//     const jsonString = JSON.stringify(sData, (key, value) => {
//       if (typeof value === 'object' && value !== null) {
//         if (cache.includes(value)) {
//           return '[Circular]';
//         }
//         cache.push(value);
//       }
//       return value;
//     });
//     // console.log(values);
//     const { data } = await customApi.post(`/api/contractor/survey/create-survey`, JSON.parse(jsonString));
//     // console.log(res);
//     // return res
//     return data;
//   } catch (error) {
//     error', error)
//     return {
//       status: false,
//       message: 'error'
//       // message: error.response.data.message || error.message,
//     };
//   }
// };

export const getAdminCreateSurvey = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/survey/create-survey`,
      values,
    );
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
    const { data } = await customApi.post(`/api/contractor/clock-out`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Update Survey
export const getAdminUpdateSurvey = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/survey/update-survey-details`,
      values,
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
export const updateBreakStart = async values => {
  try {
    const { data } = await customApi.post(`/api/contractor/mark-break`, values);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// Single Survey
export const getAdminSingleSurvey = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/survey/get-survey-by-id/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Break End
export const updateBreakEnd = async values => {
  try {
    const { data } = await customApi.post(`/api/contractor/break-end`, values);
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
export const getAdminAllSurveyItemMaster = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-item-masters?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// get dashboard data
export const getDashboardData = async () => {
  try {
    const { data } = await customApi.get(
      '/api/contractor/get-today-mark-login-and-break',
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
export const AdminCreateSurveyItemMaster = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-item-master`,
      values,
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
export const AdminUpdateSurveyItemMaster = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-item-master-details`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postCheckItemUniqueIdExists = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/check-item-unique-id-exists`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const AdminSingleSurveyItemMasterById = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-item-master-details/${id}`,
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
export const AdminDeleteSurveyItemMaster = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-item-master/${id}`,
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
      '/api/contractor/get-total-month-work-hours',
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
  pageNo,
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-purpose-master?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getSingleSurveyPurposeMasterById = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-purpose-master/${id}`,
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
export const AdminCreateSurveyPurposeMaster = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-purpose-master`,
      values,
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
export const AdminUpdateSurveyPurposeMaster = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-purpose-master`,
      values,
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
export const AdminDeleteSurveyPurposeMaster = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-purpose-master/${id}`,
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
    const { data } = await customApi.get(`/api/contractor/get-all-module`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// Create Enable Disable Features
export const AdminCreateEnableDisable = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/set-permission-on-role-basis`,
      values,
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
export const AdminCreateRolesPermissions = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/set-permission-on-role`,
      values,
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
export const AdminUpdateEnableDisable = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-permissions-on-role-basis`,
      values,
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
export const getAdminEnableDisablebyRole = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-admins-by-role/${id}`,
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
export const getAdminEnableDisablebyAdmin = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-users-by-admin-id/${id}`,
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
  pageNo,
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/feedback-and-suggestions?search=${
        search || ''
      }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
//get admin time-card

// Get Officers List On Ro
export const getOfficersListOnRo = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-officers-list-on-ro/${id}`,
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
    const { data } = await customApi.get(`/api/contractor/get-all-order`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getSingleOrderViaById = async id => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-order-by-id/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postOrderVia = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-order`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const updateOrderVia = async values => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-order`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const deleteOrderVia = async id => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-order/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getBrandPriceByName = async ({ name, category }) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/get-price-by-brand?&&category=${category}&&itemName=${name}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllSubCategory = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-sub-category?isDropdown=true`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
