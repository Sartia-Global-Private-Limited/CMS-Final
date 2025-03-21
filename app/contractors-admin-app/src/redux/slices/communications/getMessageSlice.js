import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

/* api for get message Listing*/
export const getMessageList = createAsyncThunk('getMessageList', async () => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/communication/communication/get-messages`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/* api for get message deatila by id*/
export const getSingleMessages = createAsyncThunk(
  'getSingleMessage',
  async id => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/communication/get-single-sender-messages/${id}`,
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

export const AddNewChat = createAsyncThunk('AddNewChat', async userId => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/communication/start-chat-to-new-user/${userId}`,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

const getMessageSlice = createSlice({
  name: 'message', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*  for pending state*/
    builder.addCase(getMessageList.pending, (state, action) => {
      state.isLoading = true;
    });

    /*  for fulfilled state*/
    builder.addCase(getMessageList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });

    /*  for rejected state*/
    builder.addCase(getMessageList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getMessageSlice.reducer;
