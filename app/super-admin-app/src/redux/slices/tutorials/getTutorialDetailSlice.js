import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting tutorial detail by id  */;
export const getTutorialDetailById = createAsyncThunk(
  'getTutorialDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `${apiBaseUrl}/api/super-admin/get-tutorial-by-id/${id}`,
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

const getTutorialDetailSlice = createSlice({
  name: 'getTutorialDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getTutorialDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getTutorialDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getTutorialDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getTutorialDetailSlice.reducer;
