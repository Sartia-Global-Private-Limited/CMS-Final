/*    ----------------Created Date :: 21- Sep -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../config';
import { store } from '../../store';

/ * api for  getting Survey  list  */;
export const getSurveyList = createAsyncThunk(
  'getSurveyList ',
  async ({ search, pageSize, pageNo, status }) => {
    const { token } = store.getState().tokenAuth;
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/survey/get-requested-survey?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&status=${status || ''}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
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

const getAllSurveyListSlice = createSlice({
  name: 'getAllSurveyList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getSurveyList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSurveyList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getSurveyList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAllSurveyListSlice.reducer;
