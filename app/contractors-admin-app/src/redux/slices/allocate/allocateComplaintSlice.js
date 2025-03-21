import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

/* action name  to be called from ui using dispatch */

export const getAllManagerList = createAsyncThunk(
  'getAllManagerList ',
  async () => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/get-all-manager-list-with-total-free-end-users`,
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
      const { data } = await customApi.get(
        `/api/contractor/get-all-supervisor-by-manager-with-count-free-end-users/${manager_id}`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error.response.data.message || error.message,
      };
    }
  },
);

export const updateAllocateComplaint = createAsyncThunk(
  'updateAllocateComplaint',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/update-assign-complaint-to-user`,
        reqBody,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error.response.data.message || error.message,
      };
    }
  },
);

export const allocateComplaint = createAsyncThunk(
  'allocateComplaint',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/assign-complaint-to-user`,
        reqBody,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error.response.data.message || error.message,
      };
    }
  },
);

export const holdComplaint = createAsyncThunk(
  'holdComplaint',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/hold-and-transfer-complaints`,
        reqBody,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error.response.data.message || error.message,
      };
    }
  },
);

export const reworkComplaint = createAsyncThunk(
  'reworkComplaint',
  async reqBody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/re-work-for-resolved-complaints`,
        reqBody,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error.response.data.message || error.message,
      };
    }
  },
);
export const getAllFreeUserList = createAsyncThunk(
  'getAllFreeUserList',
  async supervisor_id => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/get-all-end-users-by-supervisor/${supervisor_id}`,
      );

      return data;
    } catch (error) {
      return {
        status: false,
        message: error.response.data.message || error.message,
      };
    }
  },
);

const allocateComplaintSlice = createSlice({
  name: 'allocateComplaint', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllManagerList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllManagerList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllManagerList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default allocateComplaintSlice.reducer;
