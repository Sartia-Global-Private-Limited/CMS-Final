import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting Earthing testing  list  */;
export const getAllEarthingTesting = createAsyncThunk(
  'getAllEarthingTesting ',
  async ({search, pageSize, pageNo, status}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/earthing-testing/get-earthing-testing-lists?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&status=${
          status || ''
        }`,
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

const getAllETListSlice = createSlice({
  name: 'getAllETList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllEarthingTesting.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllEarthingTesting.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllEarthingTesting.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAllETListSlice.reducer;
