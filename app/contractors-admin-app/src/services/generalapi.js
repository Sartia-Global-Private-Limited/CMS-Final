import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../redux/BaseQuery';

export const generalApi = createApi({
  reducerPath: 'generalApi',
  baseQuery,
  endpoints: builder => ({
    getSidebarMenu: builder.query({
      query: () => `/api/contractor/get-contractor-sidebar?type=CONTRACTOR`,
      transformResponse: rawResult => rawResult?.data || null,
    }),
    getFromCompany: builder.query({
      query: () => `/api/contractor/get-from-companies`,
      transformResponse: rawResult => rawResult?.data || [],
    }),
    getToCompany: builder.query({
      query: ({ isDropdown = '' }) =>
        `/api/contractor/get-my-company-list?isDropdown=${isDropdown}`,
      transformResponse: rawResult => rawResult?.data || [],
    }),
  }),
});

export const {
  useGetSidebarMenuQuery,
  useGetFromCompanyQuery,
  useGetToCompanyQuery,
} = generalApi;
