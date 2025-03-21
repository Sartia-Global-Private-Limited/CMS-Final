import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/ * api for  getting all feedback list */;
export const getAllFeedbackList = createAsyncThunk(
  'getAllFeedbackList ',
  async ({isDropdown, search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/feedback-suggestion/get-all-feedback-and-complaint?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}&&isDropdown=${
          isDropdown || ''
        }`,
      );

      return data;
    } catch (error) {
      return {
        category: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);

const getFeedbackListSlice = createSlice({
  name: 'getFeedbackList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllFeedbackList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllFeedbackList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllFeedbackList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getFeedbackListSlice.reducer;
