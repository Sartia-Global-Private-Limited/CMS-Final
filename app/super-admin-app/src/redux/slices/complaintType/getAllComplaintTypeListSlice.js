import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/* action name  to be called from ui using dispatch */

export const allComplaintTypeList = createAsyncThunk(
  'allComplaintTypeList',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-all-complaints-sub-types?search=${
          search || ''
        }&pageSize=${pageSize || ''}&pageNo=${pageNo || ''}`,
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

export const getComplaintTypeDetailById = createAsyncThunk(
  'getComplaintTypeDetailById',
  async Id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/get-order-by-id/${Id}`,
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
export const createComplaintType = createAsyncThunk(
  'createComplaintType',
  async values => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/create-complaint-sub-type?action=created&module_id=5&sub_module_id=12`,
        values,
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

/* api for deleting oreder via deatail by id*/
export const deleteComplaintTypeById = createAsyncThunk(
  'deleteComplaintTypeById',
  async Id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/delete-order/${Id}`,
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

export const updatComplaintTypeById = createAsyncThunk(
  'updatComplaintTypeById',
  async requestbody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/update-complaint-sub-types-details?action=updated&module_id=5&sub_module_id=12`,
        requestbody,
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

const getAllComplaintTypeListSlice = createSlice({
  name: 'allComplaintType',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(allComplaintTypeList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(allComplaintTypeList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(allComplaintTypeList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAllComplaintTypeListSlice.reducer;
