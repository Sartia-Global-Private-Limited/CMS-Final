import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/* action name  to be called from ui using dispatch */

export const allOutletsList = createAsyncThunk(
  'allOutletsList',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/outlets/all-outlets?search=${search || ''}&pageSize=${
          pageSize || ''
        }&pageNo=${pageNo || ''}`,
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

export const getOutletsDetailById = createAsyncThunk(
  'getOutletsDetailById',
  async Id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/outlets/get-outlet/${Id}`,
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

/* api for creatign oreder via deatail*/
export const createOutlets = createAsyncThunk('createOutlets', async values => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/outlets/add-outlet?module_id=4&sub_module_id=17&action=created`,
      values,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
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
});

/* api for deleting oreder via deatail by id*/
export const deleteOutletsById = createAsyncThunk(
  'deleteOutletsById',
  async Id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/outlets/delete-outlet/${Id}?module_id=4&sub_module_id=16&action=deleted`,
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

/* api for updating oreder via deatail*/
export const updateOutletsById = createAsyncThunk(
  'updateOutletsById',
  async requestbody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/outlets/update-outlet/?module_id=4&sub_module_id=18&action=updated`,
        requestbody,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return data;
    } catch (error) {
      console.log('error', error);
      return {
        status: false,
        message: error?.response?.data?.message || error?.message,
      };
    }
  },
);

const getallOutletsListSlice = createSlice({
  name: 'allOutlets',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(allOutletsList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(allOutletsList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(allOutletsList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getallOutletsListSlice.reducer;
