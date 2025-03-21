/*    ----------------Created Date :: 16-April -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting expense request  detail by id  */;
export const getExpenseRequestDetailById = createAsyncThunk(
  'getExpenseRequestDetailById ',
  async ({id, search}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-expense-request-by-id/${id}/?search=${
          search || ''
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

const getExpenseRequestDetailSlice = createSlice({
  name: 'getExpenseRequestDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getExpenseRequestDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getExpenseRequestDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getExpenseRequestDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getExpenseRequestDetailSlice.reducer;
