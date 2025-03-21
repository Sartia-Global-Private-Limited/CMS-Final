import { createSlice, createAsyncThunk, isAction } from '@reduxjs/toolkit';
import { customApi } from '../../../config';

{
  /* action name  to be called from ui using dispatch */
}

export const dummyName = createAsyncThunk('dummyName', async requestbody => {
  try {
    const { data } = await customApi.get(`api string url / ${requestbody}`);
    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

const givenNameSlice = createSlice({
  name: 'nameOfReducer', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*  for pending state*/
    builder.addCase(dummyName.pending, (state, action) => {
      state.isLoading = true;
    });

    /*  for fulfilled state*/
    builder.addCase(dummyName.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });

    /*  for rejected state*/
    builder.addCase(dummyName.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default givenNameSlice.reducer;
