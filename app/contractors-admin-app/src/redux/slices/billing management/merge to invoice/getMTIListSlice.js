/*    ----------------Created Date :: 9 -July -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting list of  Ready to merge in merge inovice */;
export const getMTIReadyToMergeList = createAsyncThunk(
  'getMTIReadyToMergeList ',
  async ({
    search,
    status,
    pageSize,
    pageNo,
    poId,
    roId,
    billingToId,
    billingFromId,
  }) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-invoice-data?status=${
          status || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }&&po_id=${poId || ''}&&ro_id=${roId || ''}&&billing_to=${
          billingToId || ''
        }&&billing_from=${billingFromId || ''}`,
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

/ * api for  getting list of merge to invoice,discard,final List */;
export const getMTIFinalDiscardList = createAsyncThunk(
  'getMTIFinalDiscardList ',
  async ({search, status, pageSize, pageNo}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-merged-invoice?merged_invoice_status=${
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

const getMTIListSlice = createSlice({
  name: 'getMTIList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for list of ready to pi*/
    builder.addCase(getMTIReadyToMergeList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getMTIReadyToMergeList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getMTIReadyToMergeList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
    /*for list of discard,final and ready to pi*/
    builder.addCase(getMTIFinalDiscardList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getMTIFinalDiscardList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getMTIFinalDiscardList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getMTIListSlice.reducer;
