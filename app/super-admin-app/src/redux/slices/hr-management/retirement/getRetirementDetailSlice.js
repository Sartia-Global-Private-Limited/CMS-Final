import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting promotion and demotion detail by id */;

export const getRetirementDetailById = createAsyncThunk(
  'getRetirementDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/payroll/pension/get-single-registered-pension-details/${id}`,
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
