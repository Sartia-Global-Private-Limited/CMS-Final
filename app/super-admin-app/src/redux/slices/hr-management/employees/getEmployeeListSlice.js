import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting employee list  */;

export const getEmployeeList = createAsyncThunk(
  'getEmployeeList ',
  async ({search, pageSize, pageNo, isDropdown}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/hr-employees/get-all-admin-employees?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&${
          isDropdown || ''
        }`,
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

const getEmployeeListSlice = createSlice({
  name: 'getEmployeeList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getEmployeeList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getEmployeeList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getEmployeeList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getEmployeeListSlice.reducer;
