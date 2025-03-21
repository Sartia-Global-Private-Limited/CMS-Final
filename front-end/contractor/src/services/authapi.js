import axios from "axios";
import { QUERY_PARAMS } from "../utils/helper";

export const customApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

customApi.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("cms-ca-token");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// API FOR LOGIN

export const adminLogin = async (values) => {
  try {
    const { data } = await customApi.post(`/api/contractor/login`, values);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const adminProfile = async (values) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/profile/get-profile`,
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

export const adminProfileUpdate = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/profile-update`,
      values
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
    const { data } = await customApi.post(
      `/api/contractor/change-password`,
      values
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
export const getAllCitiesByCompany = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/company/get-cities-based-on-company?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const addAdminMyCompanies = async (values, module) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/company/${module}/create-company`,
      values
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
      `/api/contractor/company/my-company/get-my-company-list?${queryParams}`
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
      `/api/contractor/company/my-company/get-my-company-single-details/${id}`
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
      `/api/contractor/company/my-company/update-my-company-details`,
      values
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
      `/api/contractor/company/${module}/delete-my-company/${id}`
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
    const { data } = await customApi.get("/api/contractor/get-company-types");
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
      `/api/contractor/company/client/all-sale-companies?${queryParams}`
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
      `/api/contractor/company/client/get-sale-company/${id}`
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
      `/api/contractor/company/client/update-sale-company`,
      values
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
      `/api/contractor/company/vendor/all-purchase-companies?${queryParams}`
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
      `/api/contractor/company/vendor/get-purchase-company/${id}`
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
      `/api/contractor/company/vendor/update-purchase-company`,
      values
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
      `/api/contractor/company/all-company/get-all-companies?${queryParams}`
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
      `/api/contractor/company/all-company/get-all-companies-for-chart?${queryParams}`
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
      `/api/contractor/company/all-company/get-company-details-by-id/${id}`
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
      `/api/contractor/company/all-company/update-all-company-details`,
      values
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

// energy company

export const getAllEneryComnies = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-active-energy-companies`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// API'S for OUTLET MODULE
//zone
export const getAdminEnergyCompanyassignZone = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-energy-company-assign-zones/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// ro
export const getRoOnZoneId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-regional-office-on-zone-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// sales
export const getSalesOnRoId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-sales-area-on-ro-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// district
export const getAdminDistrictOnSaId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-district-on-sale-area-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S for COMPLAINT MODULE

export const getOfficersListOnRo = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-officers-list-on-ro/${id}`
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
      `/api/contractor/get-complaints-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getAdminAllTypesComplaint = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-complaints-sub-types?search=${
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

export const addComplaintType = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/complaints/create-complaint-type`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateComplaintType = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/complaints/update-complaint-type`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// ALL USER
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
// ALL USER
export const getAllUsersInEmployee = async (role_id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-users/${role_id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S FOR TASK MANAGER MODULE

export const getAdminCreateTask = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/task/create-task`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminAllTasklist = async (
  search,
  pageSize,
  pageNo,
  status,
  id
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/task/get-task-lists?status=${status || ""}&&search=${
        search || ""
      }&&pageSize=${pageSize || ""}&&pageNo=${pageNo || ""}&&id=${id || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminAllTaskComment = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/task/get-task-single-list/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminTaskStatus = async (task_id, status) => {
  try {
    const { data } = await customApi.put(
      `/api/contractor/update-main-task-status`,
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

export const getAdminCreateTaskComment = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/task/add-task-comment`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminUpdateTask = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-task-list`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminDeleteTask = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/task/delete-task/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminAllTaskCategory = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/get-all-task-category?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminCreateTaskCategory = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/task/task-category/create-task-category`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminUpdateTaskCategory = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/task/task-category/update-task-category`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminDeleteCategory = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/task/task-category/delete-task-category/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S FOR SURVEY MODULE

export const getAdminCreateSurvey = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/survey/create-survey`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getSingleTaskCategoryById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-task-category/${id}`
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
      `/api/contractor/survey/get-requested-survey?status=${
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
      `/api/contractor/survey/get-assign-survey?search=${
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
      `/api/contractor/survey/get-survey-response`
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
      `/api/contractor/survey/get-survey-response/${id}`
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
      `/api/contractor/survey/get-all-surveys?search=${
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
      `/api/contractor/survey/changed-survey-status`,
      values
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
      `/api/contractor/survey/assign-survey`,
      values
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
      `/api/contractor/survey/get-survey-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// API'S FOR EARTHING TESTING
export const PostAssignEarthingTesting = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/earthing-testing/assign-earthing-testing`,
      values
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
      `/api/contractor/hr-teams/create-hr-team`,
      values
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
      `/api/contractor/hr-teams/get-all-hr-teams?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getAdminSingleHRTeams = async (id, search) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/hr-teams/get-single-hr-team-detail/${id}?search=${
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
      `/api/contractor/hr-teams/get-admin-users-list-without-team`
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
      `/api/contractor/hr-teams/delete-hr-team/${id}`
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
      `/api/contractor/hr-teams/update-hr-team-details`,
      values
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
      `/api/contractor/hr-teams/add-specific-user-to-team`,
      values
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
      `/api/contractor/hr-teams/remove-specific-user-from-team`,
      values
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
      `/api/contractor/hr-employees/create-user`,
      values
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
      `/api/contractor/hr-employees/get-all-employees?${queryParams}`
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
      `/api/contractor/hr-employees/get-single-employee-detail/${id}`
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
      `/api/contractor/hr-employees/update-user-status`,
      values
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
      `/api/contractor/hr-employees/update-user`,
      values
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
      `/api/contractor/hr-employees/delete-employee/${id}`
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
      `/api/contractor/hr-attendance/get-all-user-time-sheet?${queryParams}`
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
      `/api/contractor/hr-attendance/get-user-time-sheet/${id}?date=${date}`
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
      "/api/contractor/hr-attendance/get-today-mark-login-and-break"
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
      `/api/contractor/hr-attendance/mark-manually-attendance-for-user`,
      values
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
      `/api/contractor/hr-attendance/get-all-user-today-clock-in`
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
      `/api/contractor/hr-attendance/get-all-user-today-clock-out`
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
      `/api/contractor/hr-attendance/change-user-attendance-status-by-super-admin`,
      values
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
      `/api/contractor/hr-leaves/all-apply-leave/${id}?status=${status || ""}`
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
      `/api/contractor/hr-leaves/all-apply-leave?search=${
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
      `/api/contractor/hr-leaves/leave-application-status-update`,
      values
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
      `/api/contractor/hr-leaves/apply-leave`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// PAYROLL

//  PAYROLL

export const getAllowancesPayroll = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/payroll/get-payroll/get-all-allowances?search=${
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
      `/api/contractor/payroll/get-payroll/get-all-deductions?search=${
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
      `/api/contractor/payroll/payroll-master/create-new-payroll-settings`,
      values
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
      `/api/contractor/payroll/payroll-master/get-all-payroll-master-settings`
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
      `/api/contractor/payroll/payroll-master/get-all-payroll-master-settings/${id}`
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
      `/api/contractor/payroll/payroll-master/update-payroll-master-settings`,
      values
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
      `/api/contractor/payroll/payroll-master/update-payroll-master-settings-label`,
      values
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
      `/api/contractor/payroll/payroll-master/create-allowances`,
      values
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
      `/api/contractor/payroll/payroll-master/create-deductions`,
      values
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
      `/api/contractor/payroll/group-insurance/get-group-insurance-list?search=${
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
      `/api/contractor/payroll/group-insurance/create-group-insurance`,
      values
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
      `/api/contractor/payroll/group-insurance/get-group-insurance-single-details/${id}`
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
      `/api/contractor/payroll/group-insurance/update-group-insurance-details`,
      values
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
      `/api/contractor/payroll/group-insurance/delete-group-insurance-details/${id}`
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
      `/api/contractor/payroll/salary-disbursal/get-salary-disbursal?month=${month}&&search=${
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
      `/api/contractor/payroll/salary-disbursal/get-salary-disbursal-details?id=${id}&&month=${month}`
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
      `/api/contractor/payroll/salary-disbursal/mark-salary-disbursed`,
      values
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
      `/api/contractor/payroll/loan/create-loans`,
      values
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
      `/api/contractor/payroll/loan/get-all-loans-pending?${queryParams}`
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
      `/api/contractor/payroll/loan/get-all-loans-active?${queryParams}`
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
      `/api/contractor/payroll/loan/get-all-loans-reject?${queryParams}`
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
      `/api/contractor/payroll/loan/get-all-loans-closed?${queryParams}`
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
      `/api/contractor/payroll/loan/get-loan-details/${id}`
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
      `/api/contractor/payroll/loan/update-loan-details`,
      values
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
      `/api/contractor/payroll/loan/changed-loan-status`,
      values
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
      `/api/contractor/payroll/pay-slip/get-users-pay-slip?${queryParams}`
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
      `/api/contractor/payroll/pay-slip/get-user-pay-slip-details?id=${id}&&month=${month}`
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
      `/api/contractor/payroll/promotion-demotion/employee-promotion-demotion-add`,
      values
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
      `/api/contractor/payroll/promotion-demotion/employee-promotion-demotion-get-all-list?search=${
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
      `/api/contractor/payroll/promotion-demotion/update-employee-promotion-demotion-details`,
      values
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
      `/api/contractor/payroll/resignation/get-resignations-pending-request?${queryParams}`
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
      `/api/contractor/payroll/resignation/get-resignations-approved-list?${queryParams}`
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
      `/api/contractor/payroll/resignation/get-resignations-rejected-list?${queryParams}`
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
      `/api/contractor/payroll/resignation/get-fnf-statements?${queryParams}`
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
      `/api/contractor/payroll/resignation/get-single-resignation-details/${id}`
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
      `/api/contractor/payroll/resignation/update-resignations-details`,
      values
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
      `/api/contractor/payroll/resignation/update-resignations-request-by-admin/${id}/${values}`
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
      `/api/contractor/payroll/pension/register-employee-pension`,
      values
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
      `/api/contractor/payroll/pension/get-all-registered-pension-list?search=${
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
      `/api/contractor/payroll/pension/update-registered-pension`,
      values
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
      `/api/contractor/payroll/pension/delete-register-employee-pension/${id}`
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
      `/api/contractor/payroll/employee-tracking/get-employee-history-details/${id}`
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
      `/api/contractor/payroll/employee-logs/get-all-activity-logs?search=${
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
      `/api/contractor/payroll/employee-logs/get-single-activity-logs/${id}`
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
      `/api/contractor/documents/document-category/create-document-category`,
      values
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
      `/api/contractor/documents/document-category/get-all-document-categories?search=${
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
      `/api/contractor/documents/document-category/get-all-document-categories?search=${search}`
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
      `/api/contractor/documents/document-category/update-document-category-details`,
      values
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
      `/api/contractor/documents/document-category/delete-document-category/${id}`
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
      `/api/contractor/documents/add-documents`,
      values
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
      `/api/contractor/documents/update-document`,
      values
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
      `/api/contractor/documents/delete-document/${id}`
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
      `/api/contractor/master-data/order-via/create-order`,
      values
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
      `/api/contractor/master-data/order-via/update-order`,
      values
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
      `/api/contractor/master-data/order-via/delete-order/${id}`
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
      `/api/contractor/master-data/order-via/get-order-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// **************** PREVIOUS API'S **************

export const getAllAreaManagerName = async (id) => {
  try {
    const { data } = await customApi.get(`/api/contractor/get-all-users/${id}`);
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
      `/api/contractor/get-all-roles-for-dropdown`
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
      `/api/contractor/item-master/get-item-master-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminAllSurveyItemMaster = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/get-all-item-masters?${queryParams}`
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
      `/api/contractor/item-master/import-item-master`,
      values
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
      `/api/contractor/check-item-unique-id-exists`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const AdminUpdateSurveyItemMaster = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-item-master-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const AdminCreateSurveyItemMaster = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-item-master`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminAllNotifications = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-notifications?search=${search || ""}&&pageSize=${
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
export const getAdminCountNotifications = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/count-logged-user-unread-notifications`
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
export const getNewMessages = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-total-unread-messages`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminMarkasReadNotifications = async () => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/mark-as-read-notifications`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminMarkasReadMessages = async () => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/mark-all-messages-read`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminAllEnergy = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-energy-company`
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
export const getAdminViewDocumentList = async (id) => {
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
export const getAdminUsersbyRole = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-users-by-role/${id}`
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
      `/api/contractor/get-document-category-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminSingleDocumentList = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-document-on-category-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminAllDocumentList = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-document?search=${search || ""}&&pageSize=${
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
export const getLastPricesDetailsFund = async (itemID, userId) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-last-three-prev-price-of-items/${itemID}/${userId}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const importEmployeeData = async (id, values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/import-user-data/${id}`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminUserListToAddTeams = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/hr-employees/get-users-list-without-team`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminAllLeavesType = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/hr-leave-type/get-all-leave-type?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminDeleteLeavesType = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-leave-type/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminUpdateLeavesType = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-leave-type-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminCreateLeavesType = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-leave-type`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getSingleLeaveTypeById = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/hr-leave-type/get-leave-type-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminAllRoles = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/roles?search=${search || ""}&&pageSize=${
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
export const getAllInsuranceCompany = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-insurance-company-list`
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
      `/api/contractor/get-plans-of-insurance-company/${id}`
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
      `/api/contractor/get-single-insurance-plan-details/${id}`
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
      `/api/contractor/single-employee-promotion-demotion-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
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
      `/api/contractor/get-single-registered-pension-details/${id}`
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
      `/api/contractor/delete-insurance-company/${id}`
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
      `/api/contractor/update-insurance-company-details`,
      values
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
      `/api/contractor/register-insurance-company`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAllInsuranceCompanyPlans = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-insurance-plan-list`
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
      `/api/contractor/delete-insurance-plan-details/${id}`
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
      `/api/contractor/update-insurance-plan-details`,
      values
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
      `/api/contractor/register-insurance-company-plans`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminAllHRTeamManagers = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/get-all-managers-users?${queryParams}`
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
      `/api/contractor/hr-employees/get-users-list-without-team`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const viewSingleEmployeeLeave = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-single-leave-application-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const viewSingleUsers = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/hr-attendance/get-user-by-id/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const AdminDeleteSurveyItemMaster = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-item-master/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const approveRejectFundtemById = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.post(
      `/api/contractor/change-status-for-item-master?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminRenewPlanPricing = async (values) => {
  try {
    const { data } = await customApi.post(`/api/contractor/renew-plan`, values);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminAllPlanPricing = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-plans?search=${search || ""}&&pageSize=${
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
export const getAdminSinglePlanPricing = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-plan-details/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminDeletePlanPricing = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-plan/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminUpdatePlanPricing = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-plan-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminCreatePlanPricing = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-plan`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getLastPricesDetailsStock = async (itemID, userId) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-last-three-prev-price-for-stocks/${itemID}/${userId}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminAllSuggestionsFeedbacks = async (
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/feedback-and-suggestions?search=${
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
      `/api/contractor/get-single-purpose-master/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const AdminUpdateSurveyPurposeMaster = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-purpose-master`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const AdminCreateSurveyPurposeMaster = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-purpose-master`,
      values
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
      `/api/contractor/send-survey-response`,
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
export const getAdminUpdateSurvey = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-survey-details`,
      values
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminAllSurveyPurposeMaster = async (
  search,
  pageSize,
  pageNo
) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-purpose-master?search=${
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
export const AdminDeleteSurveyPurposeMaster = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-purpose-master/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminAllTaskDashboard = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-task-status-for-dashboard`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminAllTaskByStatus = async (types) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-task-by-status?status=${types}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminUpdateTaskComment = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-task-comment`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminTutorials = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-tutorials?search=${search || ""}&&pageSize=${
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
export const getAdminTutorialType = async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/tutorials/get-tutorial-formats`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminDeleteTutorials = async (id) => {
  try {
    const { data } = await customApi.delete(
      `/api/contractor/delete-tutorial/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminSingleTutorials = async (type) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/tutorials/get-tutorial-by-id/${type}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminUpdateTutorials = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-tutorial-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const getAdminCreateTutorials = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/create-tutorial`,
      values
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
      `/api/contractor/get-all-contact-users?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
