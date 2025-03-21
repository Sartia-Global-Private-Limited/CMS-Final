import { createSlice, createAsyncThunk, isAction } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

{
  /* action name  to be called from ui using dispatch */
}

export const rejectComplaintById = createAsyncThunk(
  'rejectComplaintById',
  async requestbody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/update-complaint-status`,
        requestbody,
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

/*APi for changing the status of assigned complaint*/
export const rejectAssignedComplaintById = createAsyncThunk(
  'rejectAssignedComplaintById',
  async requestbody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/rejected-assign-complaint-users`,
        requestbody,
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

export const approveComplaintById = createAsyncThunk(
  'approveComplaintById',
  async requestbody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/approved-complaints`,
        requestbody,
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

{
  /*Api for reactive complaint by id */
}
export const reactiveComplaintById = createAsyncThunk(
  'reactiveComplaintById',
  async complaintId => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/reactive-complaints-status-update/${complaintId}`,
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

const updateComplaintStatusSlice = createSlice({
  name: 'updateComplaintStatus', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*  for pending state*/
    builder.addCase(rejectComplaintById.pending, (state, action) => {
      state.isLoading = true;
    });

    /*  for fulfilled state*/
    builder.addCase(rejectComplaintById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });

    /*  for rejected state*/
    builder.addCase(rejectComplaintById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default updateComplaintStatusSlice.reducer;
