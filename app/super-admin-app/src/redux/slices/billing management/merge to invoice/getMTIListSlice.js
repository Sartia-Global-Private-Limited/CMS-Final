/*    ----------------Created Date :: 23 -Oct -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

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
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/merged-performa/get-all-pi-merged-performa?status=${
          status || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }&&po_id=${poId || ''}&&ro_id=${roId || ''}&&billing_to=${
          billingToId || ''
        }&&billing_from=${billingFromId || ''}`,
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
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/merged-invoice/get-all-merged-invoice?status=${
          status || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }`,
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
