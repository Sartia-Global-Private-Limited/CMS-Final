/*    ----------------Created Date :: 8 -June -2024   ----------------- */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/*-------api for getiing  attachement by complaint id----------*/
export const getAttachementByComplaintId = createAsyncThunk(
  'getAttachementByComplaintId',
  async comlaint_id => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-pi-attachment-by-complaint-id/${comlaint_id}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
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
