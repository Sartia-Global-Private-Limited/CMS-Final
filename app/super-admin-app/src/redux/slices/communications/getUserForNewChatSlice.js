/*    ----------------Created Date :: 22 - Oct -2023   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/* api for get message Listing*/
export const getUserForNewChat = createAsyncThunk(
  'getUserForNewChat',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/communication/add-new-user-to-chat`,
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

const getUserForNewChatSlice = createSlice({
  name: 'Users', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*  for pending state*/
    builder.addCase(getUserForNewChat.pending, (state, action) => {
      state.isLoading = true;
    });

    /*  for fulfilled state*/
    builder.addCase(getUserForNewChat.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });

    /*  for rejected state*/
    builder.addCase(getUserForNewChat.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getUserForNewChatSlice.reducer;
