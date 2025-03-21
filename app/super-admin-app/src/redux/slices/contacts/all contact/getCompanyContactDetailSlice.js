import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting contact detail by id   */;
export const getContactDetailById = createAsyncThunk(
  'getContactDetailById ',

  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/contacts/get-stored-company-contact-details/${id}`,
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

const getCompanyContactDetailSlice = createSlice({
  name: 'getCompanyContactDetail', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getContactDetailById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getContactDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getContactDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getCompanyContactDetailSlice.reducer;
