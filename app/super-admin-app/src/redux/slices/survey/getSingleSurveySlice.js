import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting Survey  list  */;
export const getSingleSurveyDetails = createAsyncThunk(
  'getSingleSurveyDetails ',
  async ({id}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/survey/get-survey-by-id/${id}`,
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

const getSingleSurveySlice = createSlice({
  name: 'getSingleSurvey', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getSingleSurveyDetails.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSingleSurveyDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getSingleSurveyDetails.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getSingleSurveySlice.reducer;
