import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  FNF Resignation  statement   list*/;
export const getFnfList = createAsyncThunk('getFnfList ', async () => {
  try {
    const {data} = await customApi.get(
      `/api/super-admin/payroll/resignation/get-fnf-statements`,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

const getFnfResignationSlice = createSlice({
  name: 'getFnfResignation', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getFnfList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getFnfList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getFnfList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getFnfResignationSlice.reducer;
