import { customApi } from "./authapi";

customApi.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("cms-ca-token");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export const getOutletByDistrictId = async (id, sale_area_id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-outlet-by-district-id/${id}?sale_area_id=${sale_area_id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const approvedComplaint = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-complaint-status`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// All Companies
export const getAdminAllCompanies = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-all-companies?search=${search || ""}&&pageSize=${
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

// single All companies Details
export const getAdminAllCompaniesData = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-company-details-by-id/${id}`
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
export const updateAdminAllCompanies = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/update-all-company-details`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
// all sidebar api
export const getAllModule = async (type) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-contractor-sidebar?type=${type}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
