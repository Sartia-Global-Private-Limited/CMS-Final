import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting security Detail by id  */;

export const getSecurityDetailById = createAsyncThunk(
  'getSecurityDetailById ',
  async ({securityId, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/purchase-sale/purchase/get-single-po-details/${securityId}?pageSize=${
          pageSize || ''
        }&&pageNo=${pageNo || ''}`,
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

const getSecurityDetailSlice = createSlice({
  name: 'getSecurityDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getSecurityDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSecurityDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getSecurityDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSecurityDetailSlice.reducer;
