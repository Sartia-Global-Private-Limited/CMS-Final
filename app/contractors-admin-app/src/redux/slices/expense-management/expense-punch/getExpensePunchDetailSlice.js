/*    ----------------Created Date :: 18-April -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../../config';
import { store } from '../../../store';

/ * api for  getting expense  detail by compliant id and user id  */;
export const getExpensePunchDetailById = createAsyncThunk(
  'getExpensePunchDetailById ',
  async ({ complaintId, userId }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/get-expense-punch-details/${complaintId}/${userId}`,
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
/ * api for  getting approve expense  detail by compliant id and user id  */;
export const getApproveExpensePunchDetailById = createAsyncThunk(
  'getApproveExpensePunchDetailById ',
  async ({ complaintId, userId }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/expense/expense-punch/get-list-expense-punch-approve_according_to_items?complaint_id=${complaintId}&&user_id=${userId}`,
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

const getExpensePunchDetailSlice = createSlice({
  name: 'getExpensePunchDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*for pending expense punch detail*/
    builder.addCase(getExpensePunchDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getExpensePunchDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getExpensePunchDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });

    /*for approve expense punch detail*/
    builder.addCase(
      getApproveExpensePunchDetailById.pending,
      (state, action) => {
        state.isLoading = true;
      },
    );
    builder.addCase(
      getApproveExpensePunchDetailById.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      getApproveExpensePunchDetailById.rejected,
      (state, action) => {
        state.isError = true;
        state.isLoading = false;
      },
    );
  },
});

export default getExpensePunchDetailSlice.reducer;
