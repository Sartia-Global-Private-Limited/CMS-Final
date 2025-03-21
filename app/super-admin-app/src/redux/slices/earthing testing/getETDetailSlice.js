/*    ----------------Created Date :: 6 -March -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting Earthing  detail by id  */;
export const getETDetailById = createAsyncThunk(
  'getETDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/earthing-testing/get-earthing-testing-detail/${id}`,
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

const getETDetailSlice = createSlice({
  name: 'getETDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getETDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getETDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getETDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getETDetailSlice.reducer;
