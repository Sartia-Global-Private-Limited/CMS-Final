import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../../config';
import { store } from '../../store';

/ * api for  getting all Task list  */;
export const getAllTask = createAsyncThunk(
  'getAllTask ',
  async ({ search, pageSize, pageNo }) => {
    const { token } = store.getState().tokenAuth;

    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/contractor/task/get-task-lists?search=${
          search || ''
        }&&pageSize=${pageSize || ''}&&pageNo=${pageNo || ''}`,
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

const getAllTaskListSlice = createSlice({
  name: 'getAllTaskList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(getAllTask.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllTask.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(getAllTask.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAllTaskListSlice.reducer;
