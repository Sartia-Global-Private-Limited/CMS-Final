/*    ----------------Created Date :: 20- Feb -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../config';
import {store} from '../../store';

/ * api for  getting all work images list  */;
export const getAllWorkImages = createAsyncThunk(
  'getAllWorkImages ',
  async ({search, pageSize, pageNo, isDropdown, status}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-uploaded-complaint-images?status=${status}&&search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&${
          isDropdown || ''
        }`,
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

const getAllWorkImageListSlice = createSlice({
  name: 'getAllWorkImageList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllWorkImages.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllWorkImages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllWorkImages.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAllWorkImageListSlice.reducer;
