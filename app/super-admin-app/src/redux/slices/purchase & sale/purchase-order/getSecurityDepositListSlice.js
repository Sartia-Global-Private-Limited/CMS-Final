import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting all security   list  */;
export const getAllSecurityList = createAsyncThunk(
  'getAllSecurityList ',
  async ({
    search,
    pageSize,
    pageNo,
    status,
    poStatus,
    roId,
    poId,
    securityId,
  }) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/purchase-sale/purchase/get-all-generated-po?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&status=${
          status || ''
        }&&po_status=${poStatus || ''}&&ro_office=${roId || ''}&&po_number=${
          poId || ''
        }&&security_id=${securityId || ''}`,
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

const getSecurityDepositListSlice = createSlice({
  name: 'getSecurityDepositList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllSecurityList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllSecurityList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllSecurityList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSecurityDepositListSlice.reducer;
