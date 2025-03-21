import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting EmployeeNo format  list  */;

export const getAllEmployeeNoFormatList = createAsyncThunk(
  'getAllEmployeeNoFormatList ',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/master-data/employee-format/get-all-employee-number-formats?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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

const getEmployeeNoFormatListSlice = createSlice({
  name: 'getEmployeeNoFormatList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllEmployeeNoFormatList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllEmployeeNoFormatList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllEmployeeNoFormatList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getEmployeeNoFormatListSlice.reducer;
