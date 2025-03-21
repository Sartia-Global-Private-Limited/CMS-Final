import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting team detail  */;

export const getEmployeeDetail = createAsyncThunk(
  'getEmployeeDetail ',
  async ({empId}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/hr-employees/get-single-admin-employee-detail/${empId}`,
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

const getEmployeeDetailSlice = createSlice({
  name: 'getEmployeeDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getEmployeeDetail.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getEmployeeDetail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getEmployeeDetail.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getEmployeeDetailSlice.reducer;
