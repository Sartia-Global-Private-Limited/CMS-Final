/*    ----------------Created Date :: 22-Oct -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting company contact list */;
export const getCompanyContact = createAsyncThunk(
  'getCompanyContact',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/contacts/get-all-pending-account-status-of-energy-company-and-users?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);

/ * api for  getting dealer contact list */;
export const getDealerContact = createAsyncThunk(
  'getDealerContact',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/contacts/get-all-pending-account-status-of-dealers-and-users-details?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);
/ * api for  getting supplier contact list */;
export const getSupplierContact = createAsyncThunk(
  'getSupplierContact',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/contacts/get-all-pending-account-status-of-admins-and-users-details?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);

/ * api for  getting Client contact list */;
export const getClientContact = createAsyncThunk(
  'getClientContact',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/contacts/get-all-pending-account-status-contractors-and-users?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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

export const changeContactStatus = createAsyncThunk(
  'changeContactStatus',
  async requestbody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/contacts/contractors-and-users-set-account-status`,
        requestbody,
      );
      return data;
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);

const getContactListSlice = createSlice({
  name: 'getContactList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /* for company contact */
    builder.addCase(getCompanyContact.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getCompanyContact.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getCompanyContact.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /* for dealer contact */
    builder.addCase(getDealerContact.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getDealerContact.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getDealerContact.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /* for supplier contact */
    builder.addCase(getSupplierContact.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSupplierContact.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getSupplierContact.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /* for client contact */
    builder.addCase(getClientContact.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getClientContact.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getClientContact.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getContactListSlice.reducer;
