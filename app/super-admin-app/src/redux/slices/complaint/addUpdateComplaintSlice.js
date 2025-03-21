/*    ----------------Created Date :: 22 - Oct -2023   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/* action name  to be called from ui using dispatch */

export const getAllEnergyList = createAsyncThunk(
  'getAllEnergyList ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-active-energy-companies`,
      );
      if (data?.status) {
        return data;
      }
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);

export const getAllSuperVisorList = createAsyncThunk(
  'getAllSuperVisorList',
  async manager_id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-supervisor-by-manager-with-count-free-end-users/${manager_id}`,
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

export const allocateComplaint = createAsyncThunk(
  'allocateComplaint',
  async reqBody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/assign-complaint-to-user`,
        reqBody,
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
export const getAllFreeUserList = createAsyncThunk(
  'getAllFreeUserList',
  async supervisor_id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-end-users-by-supervisor/${supervisor_id}`,
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

const addUpdateComplaintSlice = createSlice({
  name: 'addUpdateComplaint', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllEnergyList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllEnergyList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllEnergyList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default addUpdateComplaintSlice.reducer;
