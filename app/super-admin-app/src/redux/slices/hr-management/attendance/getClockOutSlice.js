import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/ * api for  time sheet  list  */;

export const getClockedOutUsertList = createAsyncThunk(
  'getClockedOutUsertList ',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/hr-attendance/get-all-user-today-clock-out`,
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

const getClockOutSlice = createSlice({
  name: 'getClockOut', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getClockedOutUsertList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getClockedOutUsertList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getClockedOutUsertList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getClockOutSlice.reducer;
