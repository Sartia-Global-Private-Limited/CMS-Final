/*    ----------------Created Date :: 23-April -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting stock punch  detail by compliant id and user id  */;
export const getStockPunchDetailById = createAsyncThunk(
  'getStockPunchDetailById ',
  async ({complaintId, userId}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-stock-punch-details/${userId || ''}/${
          complaintId || ''
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
/ * api for  getting approve stock punch  detail by compliant id and user id  */;
export const getApproveStockPunchDetailById = createAsyncThunk(
  'getApproveStockPunchDetailById ',
  async ({complaintId, userId}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-all-approve-stock-punch-by-id/${
          userId || ''
        }/${complaintId || ''}`,
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

const getStockPunchDetailSlice = createSlice({
  name: 'getExpensePunchDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending stock punch detail*/
    builder.addCase(getStockPunchDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getStockPunchDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getStockPunchDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for approve stock punch detail*/
    builder.addCase(getApproveStockPunchDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      getApproveStockPunchDetailById.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getApproveStockPunchDetailById.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getStockPunchDetailSlice.reducer;
