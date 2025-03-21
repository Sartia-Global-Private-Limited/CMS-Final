import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../config';
export const getSubModuleByModuleId = createAsyncThunk(
  'getSubModuleByModuleId',
  async moduleId => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-sub-module-by-module-id/${moduleId}`,
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

const subModuleSlice = createSlice({
  name: 'subModule', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*  for pending state*/
    builder.addCase(getSubModuleByModuleId.pending, (state, action) => {
      state.isLoading = true;
    });

    /*  for fulfilled state*/
    builder.addCase(getSubModuleByModuleId.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });

    /*  for rejected state*/
    builder.addCase(getSubModuleByModuleId.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default subModuleSlice.reducer;
