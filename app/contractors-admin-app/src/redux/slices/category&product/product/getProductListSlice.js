import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/ * api for  getting Product list  */;
export const getAllProduct = createAsyncThunk(
  'getAllProduct ',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/product-management/product/product-list?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}
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

const getProductListSlice = createSlice({
  name: 'getProductList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllProduct.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllProduct.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getProductListSlice.reducer;
