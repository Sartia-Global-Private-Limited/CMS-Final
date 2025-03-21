import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

{
  /*   Action name to be callled from Ui */
}

export const getCompanyDetailById = createAsyncThunk(
  'getCompanyDetailById',
  async company_id => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/company/my-company/get-my-company-single-details/${company_id}`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error.response.data.message || error.message,
      };
    }
  },
);

export const getClientCompanyDetailById = createAsyncThunk(
  'getClientCompanyDetailById',
  async company_id => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/company/client/get-sale-company/${company_id}`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error.response.data.message || error.message,
      };
    }
  },
);

export const getVendorCompanyDetailById = createAsyncThunk(
  'getVendorCompanyDetailById',
  async company_id => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/company/vendor/get-purchase-company/${company_id}`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error.response.data.message || error.message,
      };
    }
  },
);

const companyDetailSlice = createSlice({
  name: 'companyDetail',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getCompanyDetailById.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getCompanyDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action?.payload;
    });

    builder.addCase(getCompanyDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    // for Client Company
    builder.addCase(getClientCompanyDetailById.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getClientCompanyDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action?.payload;
    });

    builder.addCase(getClientCompanyDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    // for Vendor Company
    builder.addCase(getVendorCompanyDetailById.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getVendorCompanyDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action?.payload;
    });

    builder.addCase(getVendorCompanyDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default companyDetailSlice.reducer;
