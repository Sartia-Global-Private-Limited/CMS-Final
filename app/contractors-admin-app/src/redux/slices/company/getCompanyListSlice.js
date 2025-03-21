import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

/* Generic function to create async thunks */
const createCompanyListThunk = (type, endpoint) =>
  createAsyncThunk(
    `companyList/get${type}CompanyList`,
    async ({ search, pageSize, pageNo, city }) => {
      try {
        const { data } = await customApi.get(
          `${endpoint}?city=${city}&&search=${search || ''}&&pageSize=${
            pageSize || ''
          }&&pageNo=${pageNo || ''}`,
        );
        if (data?.status) {
          return data;
        }
      } catch (error) {
        return {
          status: false,
          message: error?.response?.data?.message || error?.message,
        };
      }
    },
  );

/* Action names for different company lists */
export const getAllCompaniesList = createCompanyListThunk(
  'All',
  '/api/contractor/company/all-company/get-all-companies',
);
export const getMyCompanyList = createCompanyListThunk(
  'My',
  '/api/contractor/company/my-company/get-my-company-list',
);
export const getPurchaseCompanyList = createCompanyListThunk(
  'Purchase',
  '/api/contractor/company/vendor/all-purchase-companies',
);
export const getSalesCompanyList = createCompanyListThunk(
  'Sales',
  '/api/contractor/company/client/all-sale-companies',
);

/* Generic reducer case handler */
const handleCases = (builder, action) => {
  builder
    .addCase(action.pending, state => {
      state.isLoading = true;
    })
    .addCase(action.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    })
    .addCase(action.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
      state.error = action.error.message;
    });
};

const getCompanyListSlice = createSlice({
  name: 'getCompanyList', // to be used in UI for fetching data from store by useSelector (state => state.getCompanyList)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },
  extraReducers: builder => {
    handleCases(builder, getAllCompaniesList);
    handleCases(builder, getMyCompanyList);
    handleCases(builder, getPurchaseCompanyList);
    handleCases(builder, getSalesCompanyList);
  },
});

export default getCompanyListSlice.reducer;
