/*    ----------------Created Date :: 7-August -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/ * api for  getting company contact list */;
export const getCompanyContact = createAsyncThunk(
  'getCompanyContact',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-stored-company-contact-details?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
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
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/get-dealer-users?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
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
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/suppliers/get-client-users?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }&&isDropdown=&&status=2`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
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
  async ({ search, pageSize, pageNo, type = '' }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/contacts/get-client-users?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&type=${type}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
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
