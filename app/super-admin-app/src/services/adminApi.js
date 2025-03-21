import {customApi} from '../../config';

export const getOutletByDistrictId = async (id, sale_area_id) => {
  try {
    const {data} = await customApi.get(
      `/api/super-admin/get-outlet-by-district-id/${id}?sale_area_id=${sale_area_id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
};

export const approvedComplaint = async values => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/update-complaint-status`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
};
// All Companies
export const getAdminAllCompanies = async (search, pageSize, pageNo) => {
  try {
    const {data} = await customApi.get(
      `/api/super-admin/get-all-companies?search=${search || ''}&&pageSize=${
        pageSize || ''
      }&&pageNo=${pageNo || ''}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
};

// single All companies Details
export const getAdminAllCompaniesData = async id => {
  try {
    const {data} = await customApi.get(
      `/api/super-admin/get-company-details-by-id/${id}`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
};
// update All Companies
export const updateAdminAllCompanies = async values => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/update-all-company-details`,
      values,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
};
