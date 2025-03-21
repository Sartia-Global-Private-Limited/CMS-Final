import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';
import axios from 'axios';
import {store} from '../../store';
import {apiBaseUrl} from '../../../../config';

/*-------api for getting total member by complaint id----------*/
export const getTotalCountById = createAsyncThunk(
  'getTotalCountById',
  async comlaint_id => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-total-member-on-single-complaint/${comlaint_id}`,
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
        message: error.response.data.message || error.message,
      };
    }
  },
);

/*-------api for getting compaint timleine details by complaint id----------*/
export const getTimeLineDetailById = createAsyncThunk(
  'getTimeLineDetailById',
  async comlaint_id => {
    const {token} = store.getState().tokenAuth;
    try {
      const {data} = await axios.get(
        `${apiBaseUrl}/api/contractor/get-complaints-timeline/${comlaint_id}`,
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
        message: error.response.data.message || error.message,
      };
    }
  },
);

const getComplaintTimelineSlice = createSlice({
  name: 'getComplaintTimeline',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getTimeLineDetailById.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getTimeLineDetailById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action?.payload;
    });

    builder.addCase(getTimeLineDetailById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getComplaintTimelineSlice.reducer;
