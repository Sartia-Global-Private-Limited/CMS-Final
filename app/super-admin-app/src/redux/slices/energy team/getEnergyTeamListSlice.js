/*    ----------------Created Date :: 8- Oct -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting all energy team list */;
export const getAllEnergyTeamList = createAsyncThunk(
  'getAllEnergyTeamList',
  async ({id, userId, search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/oil-and-gas/get-energy-company-users?id=${
          id || ''
        }&&user_id=${userId || ''}&&search=${search || ''}&&pageSize=${
          pageSize || ''
        }&&pageNo=${pageNo || ''}`,
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

const getEnergyTeamListSlice = createSlice({
  name: 'getEnergyTeamList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllEnergyTeamList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllEnergyTeamList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllEnergyTeamList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getEnergyTeamListSlice.reducer;
