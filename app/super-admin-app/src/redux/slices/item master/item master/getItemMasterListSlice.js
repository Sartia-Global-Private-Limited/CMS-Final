import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting list of item master with category */;
export const getItemMasterListWithCategory = createAsyncThunk(
  'getItemMasterListWithCategory ',
  async ({category, search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-item-masters?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&category=${
          category || ''
        }`,
      );

      return data;
    } catch (error) {
      return {
        category: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);

const getItemMasterListSlice = createSlice({
  name: 'getItemMasterList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getItemMasterListWithCategory.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      getItemMasterListWithCategory.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(getItemMasterListWithCategory.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getItemMasterListSlice.reducer;
