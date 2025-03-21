/*    ----------------Created Date :: 10 August -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../config';
import { store } from '../../store';

/ * api for  getting regional office list */;
export const getAllRegionalOffice = createAsyncThunk(
  'getAllRegionalOffice ',
  async ({ search, pageSize, pageNo, roId, poId }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/complaints/get-all-complaints-via-invoice-ro?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&ro=${
          roId || ''
        }&&po_number=${poId || ''}`,
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
/ * api for  getting regional office of payment paid list with status code */;
export const getRegionalOfficeWithStatusCode = createAsyncThunk(
  'getRegionalOfficeWithStatusCode ',
  async ({ status, search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/get-ro-payment-paid?status=${
          status || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }`,
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

const getRegionalOfficeListSlice = createSlice({
  name: 'getRegionalOfficeList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllRegionalOffice.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllRegionalOffice.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllRegionalOffice.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    builder.addCase(
      getRegionalOfficeWithStatusCode.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getRegionalOfficeWithStatusCode.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getRegionalOfficeWithStatusCode.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getRegionalOfficeListSlice.reducer;
