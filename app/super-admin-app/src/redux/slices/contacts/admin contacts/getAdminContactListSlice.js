/*    ----------------Created Date :: 22-Oct -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting company contact list */;
export const getAdminCompanyContact = createAsyncThunk(
  'getAdminCompanyContact',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/contacts/get-all-stored-company-contact-details?search=${
          search || ''
        }&&pageSize=${pageSize || 10}&&pageNo=${pageNo || 1}`,
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

export const getOilAndGasContacts = createAsyncThunk(
  'getOilAndGasContacts',
  async ({search, pageSize, pageNo, id, user_id}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/contacts/get-energy-company-users?id=${id}&&user_id=${user_id}&&search=${
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

export const getFuelStationContacts = createAsyncThunk(
  'getFuelStationContacts',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/contacts/all-outlets?search=${
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
  async ({search, pageSize, pageNo, status = '', isDropdown = false}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/contacts/get-client-users?search=${
          search || ''
        }&pageSize=${pageSize || ''}&pageNo=${pageNo || ''}&type=vendor`,
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
        `/api/super-admin/contacts/get-client-users?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&type=client`,
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

const getAdminContactListSlice = createSlice({
  name: 'getAdminContactList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /* for company contact */
    builder.addCase(getAdminCompanyContact.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAdminCompanyContact.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAdminCompanyContact.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /* for Oil And Gas contact */
    builder.addCase(getOilAndGasContacts.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getOilAndGasContacts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getOilAndGasContacts.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /* for Fuel Station contact */
    builder.addCase(getFuelStationContacts.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getFuelStationContacts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getFuelStationContacts.rejected, (state, action) => {
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

export default getAdminContactListSlice.reducer;
