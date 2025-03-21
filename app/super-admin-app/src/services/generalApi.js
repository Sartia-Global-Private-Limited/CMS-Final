import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from '../redux/BaseQuery';

export const generalApi = createApi({
  reducerPath: 'generalApi',
  baseQuery,
  endpoints: builder => ({
    getSidebarMenu: builder.query({
      query: () => `/api/super-admin/roles-permission/get-all-module/1`,
      transformResponse: rawResult => rawResult?.data || [],
    }),
    getFromCompany: builder.query({
      query: () => `/api/super-admin/get-from-companies`,
      transformResponse: rawResult => rawResult?.data || [],
    }),
    getToCompany: builder.query({
      query: ({isDropdown = ''}) =>
        `/api/super-admin/get-my-company-list?isDropdown=${isDropdown}`,
      transformResponse: rawResult => rawResult?.data || [],
    }),
    getEmployeeFormat: builder.query({
      query: ({pageNo = 1, pageSize = 10}) =>
        `/api/super-admin/master-data/employee-format/get-all-employee-number-formats?search=${search}&&pageSize=${pageSize}&&pageNo=${pageNo}`,
      transformResponse: rawResult => rawResult?.data || [],
    }),
  }),
});

export const {
  useGetSidebarMenuQuery,
  useGetFromCompanyQuery,
  useGetToCompanyQuery,
  useGetEmployeeFormatQuery,
} = generalApi;
