import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  getting CompanyNo format  list  */;

export const getAllCompanyNoFormatList = createAsyncThunk(
  'getAllCompanyNoFormatList ',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/master-data/client-vendor-format/get-all-client-vendor-number-formats?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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

const getCompanyNoFormatListSlice = createSlice({
  name: 'getCompanyNoFormatList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllCompanyNoFormatList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllCompanyNoFormatList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllCompanyNoFormatList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getCompanyNoFormatListSlice.reducer;
