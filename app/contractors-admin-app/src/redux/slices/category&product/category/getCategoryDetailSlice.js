import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/ * api for  getting Category  detail by id  */;
export const getCategoryDetailById = createAsyncThunk(
  'getCategoryDetailById ',
  async id => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/product-management/category/get-category-detail/${id}`,
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

const getCategoryDetailSlice = createSlice({
  name: 'getCategoryDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getCategoryDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getCategoryDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getCategoryDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getCategoryDetailSlice.reducer;
