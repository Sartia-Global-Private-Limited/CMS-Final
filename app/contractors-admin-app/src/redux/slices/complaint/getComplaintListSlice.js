import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

/* action name  to be called from ui using dispatch */

export const getRejectedComplaintList = createAsyncThunk(
  'getRejectedComplaintList',
  async ({ search, pageSize, pageNo }) => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/complaints/get-rejected-complaints?search=${
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

export const getResolvedComplaintList = createAsyncThunk(
  'getResolvedComplaintList',
  async ({ search, pageSize, pageNo }) => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/complaints/get-all-resolved-complaints?search=${
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

const getComplaintListSlice = createSlice({
  name: 'getComplaintList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*  for pending state*/
    builder.addCase(getRejectedComplaintList.pending, (state, action) => {
      state.isLoading = true;
    });

    /*  for fulfilled state*/
    builder.addCase(getRejectedComplaintList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });

    /*  for rejected state*/
    builder.addCase(getRejectedComplaintList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*  for pending state*/
    builder.addCase(getResolvedComplaintList.pending, (state, action) => {
      state.isLoading = true;
    });

    /*  for fulfilled state*/
    builder.addCase(getResolvedComplaintList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });

    /*  for rejected state*/
    builder.addCase(getResolvedComplaintList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getComplaintListSlice.reducer;
