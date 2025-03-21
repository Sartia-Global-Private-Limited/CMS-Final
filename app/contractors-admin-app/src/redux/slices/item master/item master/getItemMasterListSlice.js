/*    ----------------Created Date :: 6- August -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting list of item master with category */;
export const getItemMasterListWithCategory = createAsyncThunk(
  'getItemMasterListWithCategory ',
  async ({category, search, pageSize, pageNo, isDropdown, status}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-item-masters?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&status=${status || ''}&&category=${
          category || ''
        }&&isDropdown=${isDropdown || ''}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
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
