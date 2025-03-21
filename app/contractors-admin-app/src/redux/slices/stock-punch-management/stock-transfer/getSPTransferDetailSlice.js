/*    ----------------Created Date :: 24-April -2024   ----------------- */

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {apiBaseUrl} from '../../../../../config';
import {store} from '../../../store';

/ * api for  getting stock punch transfer  detail by transfer by id and transfer to id  */;
export const getSPTransferDetailById = createAsyncThunk(
  'getSPTransferDetailById ',
  async ({transferById, transferToId}) => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-stock-quantity-transfer-by-id/${
          transferById || ''
        }/${transferToId || ''}`,
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

const getSPTransferDetailSlice = createSlice({
  name: 'getSPTransferDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getSPTransferDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSPTransferDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getSPTransferDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSPTransferDetailSlice.reducer;
