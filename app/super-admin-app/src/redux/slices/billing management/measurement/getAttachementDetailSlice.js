/*    ----------------Created Date :: 23 -Oct -2024   ----------------- */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/*-------api for getiing  attachement by complaint id----------*/
export const getAttachementByComplaintId = createAsyncThunk(
  'getAttachementByComplaintId',
  async comlaint_id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-pi-attachment-by-complaint-id/${comlaint_id}`,
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

const getAttachementDetailSlice = createSlice({
  name: 'getAttachementDetail',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAttachementByComplaintId.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getAttachementByComplaintId.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action?.payload;
    });

    builder.addCase(getAttachementByComplaintId.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAttachementDetailSlice.reducer;
