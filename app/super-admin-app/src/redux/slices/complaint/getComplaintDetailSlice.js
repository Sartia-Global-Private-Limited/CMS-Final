import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';
import {store} from '../../store';

{
  /*   Action name to be callled from Ui */
}
/*-------api for getiing single compalint by complaint id----------*/
export const getComlaintDetailById = createAsyncThunk(
  'getComlaintDetailById',
  async comlaint_id => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await customApi.get(
        `api/super-admin/complaints/get-complaints-details/${comlaint_id}`,
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

/*-------api for getiing approved  compalint details by complaint id----------*/
export const getApprovedComlaintDetailById = createAsyncThunk(
  'getApprovedComlaintDetailById',
  async comlaint_id => {
    try {
      const {data} = await customApi.get(
        `api/super-admin/get-approved-complaints-details/${comlaint_id}`,
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

const getComplaintDetailSlice = createSlice({
  name: 'getComplaintDetail',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getApprovedComlaintDetailById.pending, (state, action) => {
      //   'in pending state of getComlaintDetailById===> ',
      //   action.payload,
      // );
      state.isLoading = true;
    });

    builder.addCase(
      getApprovedComlaintDetailById.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action?.payload;
      },
    );

    builder.addCase(getApprovedComlaintDetailById.rejected, (state, action) => {
      //   'in rejected state of getComlaintDetailById ====>',
      //   action.payload,
      // );
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getComplaintDetailSlice.reducer;
