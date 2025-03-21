import { createSlice, createAsyncThunk, isAction } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

{
  /* action name  to be called from ui using dispatch */
}

export const updateMyComapnyById = createAsyncThunk(
  'updateMyComapnyById',
  async requestbody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/company/my-company/update-my-company-details`,
        requestbody,
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

export const updatePurchaseComapnyById = createAsyncThunk(
  'updatePurchaseComapnyById',
  async requestbody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/update-purchase-company`,
        requestbody,
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

export const updateAllComapnyById = createAsyncThunk(
  'updateAllComapnyById',
  async requestbody => {
    try {
      const { data } = await customApi.post(
        `/api/contractor/update-all-company-details`,
        requestbody,
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
export const updateSalesComapnyById = createAsyncThunk(
  'updateSaledComapnyById',
  async requestbody => {
    try {
      const { data } = await customApi.post(
        `api/contractor/update-sale-company`,
        requestbody,
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

const updateCompanySlice = createSlice({
  name: 'updateCompany', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*  for pending state*/
    builder.addCase(updateSalesComapnyById.pending, (state, action) => {
      state.isLoading = true;
    });

    /*  for fulfilled state*/
    builder.addCase(updateSalesComapnyById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });

    /*  for rejected state*/
    builder.addCase(updateSalesComapnyById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default updateCompanySlice.reducer;
