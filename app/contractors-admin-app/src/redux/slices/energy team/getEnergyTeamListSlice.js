import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../config';
import { store } from '../../store';

/ * api for  getting all energy team list */;
export const getAllEnergyTeamList = createAsyncThunk(
  'getAllEnergyTeamList ',
  async ({ id, userId, search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/oil-and-gas/get-energy-company-users?id=${
          id || ''
        }&&user_id=${userId || ''}&&search=${search || ''}&&pageSize=${
          pageSize || ''
        }&&pageNo=${pageNo || ''}`,
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
