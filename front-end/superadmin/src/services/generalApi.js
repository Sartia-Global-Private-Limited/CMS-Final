import { customApi } from "./authapi";

customApi.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("cms-sa-token");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export const getAllStates = async () => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/company/get-all-states`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
export const getAllCitiesByStateId = async (id) => {
  try {
    const { data } = await customApi.get(
      `/api/super-admin/company/get-cities-based-on-state/${id}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};
