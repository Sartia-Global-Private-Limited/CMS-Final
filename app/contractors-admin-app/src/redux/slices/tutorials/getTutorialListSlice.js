/*    ----------------Created Date :: 4 - March -2023   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

/* action name  to be called from ui using dispatch */

export const getAllTutorialList = createAsyncThunk(
  'getAllTutorialList ',
  async ({ search, pageSize, pageNo }) => {
    try {
      const { data } = await customApi.get(
        `/api/contractor/get-all-tutorials?search=${search || ''}&&pageSize=${
          pageSize || ''
        }&&pageNo=${pageNo || ''}`,
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

const getTutorialListSlice = createSlice({
  name: 'getTutorialList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllTutorialList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllTutorialList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllTutorialList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getTutorialListSlice.reducer;
