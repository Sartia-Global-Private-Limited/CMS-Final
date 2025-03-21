/*    ----------------Created Date :: 22 - Oct -2024   ----------------- */

import {createSlice, createAsyncThunk, isAction} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

{
  /* action name  to be called from ui using dispatch */
}

export const deleteCompanyById = createAsyncThunk(
  'deleteCompanyById',
  async companyId => {
    try {
      const {data} = await customApi.post(
        `api/super-admin/delete-my-company/${companyId}`,
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

const deleteCompanySlice = createSlice({
  name: 'deleteCompany', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*  for pending state*/
    builder.addCase(deleteCompanyById.pending, (state, action) => {
      state.isLoading = true;
    });

    /*  for fulfilled state*/
    builder.addCase(deleteCompanyById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });

    /*  for rejected state*/
    builder.addCase(deleteCompanyById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default deleteCompanySlice.reducer;
