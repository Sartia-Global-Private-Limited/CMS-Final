import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { store } from '../../../store';
import { apiBaseUrl } from '../../../../../config';

/ * api for  getting promotion and demotion detail by id */;

export const getRetirementDetailById = createAsyncThunk(
  'getRetirementDetailById ',
  async id => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/payroll/pension/get-single-registered-pension-details/${id}`,
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

const getRetirementDetailSlice = createSlice({
  name: 'getRetirementDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getRetirementDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getRetirementDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getRetirementDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getRetirementDetailSlice.reducer;
