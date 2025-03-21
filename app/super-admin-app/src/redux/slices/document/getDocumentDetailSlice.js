/*    ----------------Created Date :: 23- Oct -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting document  detail by id  */;
export const getDocumemtDetailById = createAsyncThunk(
  'getDocumemtDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/view-document/${id}`,
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

const getDocumentDetailSlice = createSlice({
  name: 'getDocumentDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getDocumemtDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getDocumemtDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getDocumemtDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getDocumentDetailSlice.reducer;
