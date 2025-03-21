import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import moment from 'moment';
import {customApi} from '../../../../../config';

/ * api for  time sheet  list  */;

export const getTimeSheetList = createAsyncThunk(
  'getTimeSheetList',
  async ({startDate, endDate, pageSize = 10, pageNo = 1}) => {
    {
      /* date format ==> MM - DD - YYYY*/
    }
    const convertedStartDate = moment(startDate).format('DD-MM-YYYY');
    const convertedEndDate = moment(endDate).format('DD-MM-YYYY');

    try {
      const {data} = await customApi.get(
        `/api/super-admin/hr-attendance/get-all-user-time-sheet?start_date=${convertedStartDate}&end_date=${convertedEndDate}&pageSize=${pageSize}&pageNo=${pageNo}`,
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

const getTimeSheetSlice = createSlice({
  name: 'getTimeSheet', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getTimeSheetList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getTimeSheetList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getTimeSheetList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getTimeSheetSlice.reducer;
