import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../../config';

/ * api for  getting EmployeeNo formats  detail by id  */;
export const getEmployeeNoFormatDetailById = createAsyncThunk(
  'getEmployeeNoFormatDetailById ',
  async id => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/master-data/employee-format/get-employee-number-format-details/${id}`,
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

const getEmployeeNoFormatDetailSlice = createSlice({
  name: 'getEmployeeNoFormatDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getEmployeeNoFormatDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      getEmployeeNoFormatDetailById.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(getEmployeeNoFormatDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getEmployeeNoFormatDetailSlice.reducer;
