/*    ----------------Created Date :: 2-Feb -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { store } from '../../../store';
import { apiBaseUrl } from '../../../../../config';

/ * api for  getting  insurance single detail by insurance  id  */;

export const getInsuranceDetail = createAsyncThunk(
  'getInsuranceDetail ',
  async ({ insuranceId }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/payroll/group-insurance/get-group-insurance-single-details/${insuranceId}`,
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

const getInsuranceDetailSlice = createSlice({
  name: 'getInsuranceDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getInsuranceDetail.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getInsuranceDetail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getInsuranceDetail.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getInsuranceDetailSlice.reducer;
