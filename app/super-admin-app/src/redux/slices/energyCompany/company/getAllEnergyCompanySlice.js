/*    ----------------Created Date :: 22- oct -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/* action name  to be called from ui using dispatch */

export const allEnergyCompanyList = createAsyncThunk(
  'allEnergyCompanyList',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-energy-company`,
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

const getAllEnergyCompanySlice = createSlice({
  name: 'getAllECList',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(allEnergyCompanyList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(allEnergyCompanyList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(allEnergyCompanyList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAllEnergyCompanySlice.reducer;
