import { customApi } from "./authapi";

customApi.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("cms-sa-token");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export const getOutletByDistrictId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/outlets/get-outlet-by-district-id/${id}`
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
      `/api/super-admin/update-complaint-status`,
      values
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
      `/api/super-admin/get-all-companies?search=${search || ""}&&pageSize=${
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
      `/api/super-admin/get-company-details-by-id/${id}`
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
export const updateAdminAllCompanies = async (values, params) => {
  try {
    const { data } = await customApi.post(
      `/api/super-admin/update-all-company-details`,
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
