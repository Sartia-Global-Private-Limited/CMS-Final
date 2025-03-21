import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting  insurance single detail by insurance  id  */;

export const getInsuranceDetail = createAsyncThunk(
  'getInsuranceDetail ',
  async ({insuranceId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/payroll/group-insurance/get-group-insurance-single-details/${insuranceId}`,
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
