/*    ----------------Created Date :: 30- jan -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting team detail  */;

export const getUserDetailById = createAsyncThunk(
  'getUserDetailById ',
  async empId => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/hr-attendance/get-user-by-id/${empId}`,
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

const getUserDetailSlice = createSlice({
  name: 'getUserDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getUserDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getUserDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getUserDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getUserDetailSlice.reducer;
