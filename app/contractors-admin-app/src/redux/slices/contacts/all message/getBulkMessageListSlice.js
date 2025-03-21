import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/ * api for  getting all bulk message list */;
export const getAllBulkMessage = createAsyncThunk(
  'getAllBulkMessage ',
  async ({ search, pageSize, pageNo, upcoming, status }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-messages?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&upcoming=${upcoming || ''}&&status=${status || ''}`,
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
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);

const getBulkMessageListSlice = createSlice({
  name: 'getBulkMessageList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllBulkMessage.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllBulkMessage.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllBulkMessage.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getBulkMessageListSlice.reducer;
