import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../config';
import { store } from '../../store';

/ * api for  getting suppliers list with code */;
export const getSupplierListWithCode = createAsyncThunk(
  'getSupplierListWithCode ',
  async ({ status, search, pageSize, pageNo, isDropdown }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/suppliers/get-suppliers?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${
          pageNo || ''
        }&&isDropdown=false&&status=${status || ''}`,
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

const getSupplierListSlice = createSlice({
  name: 'getSupplierList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getSupplierListWithCode.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSupplierListWithCode.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getSupplierListWithCode.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSupplierListSlice.reducer;
