/*    ----------------Created Date :: 23 -Oct -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting list of ready to merge Pi  */;
export const getReadyToMergePiList = createAsyncThunk(
  'getReadyToMergePiList ',
  async ({
    search,
    status,
    pageSize,
    pageNo,
    poId,
    RoId,
    billingToId,
    billingFromId,
  }) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/merged-performa/get-all-pi-merged-performa?status=${
          status || ''
        }&&po_id=${poId || ''}&&regional_office_id=${
          RoId || ''
        }&&billing_from=${billingFromId || ''}&&billing_to=${
          billingToId || ''
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

/ * api for  getting list of draft,discard,final and ready to pi measurement */;

export const getMergeToPiFinalDiscardList = createAsyncThunk(
  'getMergeToPiFinalDiscardList ',
  async ({search, status, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/billing/merged-performa/get-all-merged-proforma-invoice?status=${
          status || ''
        }&&search=${search || ''}&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }
        `,
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

const getMTPIListSlice = createSlice({
  name: 'getMTPIList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for list of all complaint and process to measurement*/
    builder.addCase(getReadyToMergePiList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getReadyToMergePiList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getReadyToMergePiList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
    /*for list of draft ,discard,final and ready to pi*/
    builder.addCase(getMergeToPiFinalDiscardList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getMergeToPiFinalDiscardList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getMergeToPiFinalDiscardList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getMTPIListSlice.reducer;
