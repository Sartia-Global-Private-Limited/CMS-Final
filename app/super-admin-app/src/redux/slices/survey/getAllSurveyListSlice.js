import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting Survey  list  */;
export const getSurveyList = createAsyncThunk(
  'getSurveyList ',
  async ({search, pageSize, pageNo, status}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/survey/get-requested-survey?search=${
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

export const getAllSurveyList = createAsyncThunk(
  'getSurveyList ',
  async ({search, pageSize, pageNo, status}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/survey/get-all-surveys?search=${
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
