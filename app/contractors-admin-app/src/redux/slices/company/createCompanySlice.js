import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

{
  /* action name  to be called from ui using dispatch */
}

export const createContractorCompany = createAsyncThunk(
  'createContractorCompany',
  async values => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/company/my-company/create-company`,
        values,
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

const createCompanySlice = createSlice({
  name: 'createCompany', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*  for pending state*/
    builder.addCase(createContractorCompany.pending, (state, action) => {
      state.isLoading = true;
    });

    /*  for fulfilled state*/
    builder.addCase(createContractorCompany.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });

    /*  for rejected state*/
    builder.addCase(createContractorCompany.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default createCompanySlice.reducer;
