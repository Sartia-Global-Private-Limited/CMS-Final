import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting item master item detail by id   */;
export const getItemMastertDetailById = createAsyncThunk(
  'getItemMastertDetailById ',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-item-master-details/${id}`,
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

const getItemMasterDetailSlice = createSlice({
  name: 'getItemMasterDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getItemMastertDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getItemMastertDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getItemMastertDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getItemMasterDetailSlice.reducer;
