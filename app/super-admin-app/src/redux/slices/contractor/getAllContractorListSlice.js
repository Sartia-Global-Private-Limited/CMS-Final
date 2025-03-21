import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/* action name  to be called from ui using dispatch */

export const allContractorList = createAsyncThunk(
  'allContractorList',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/contractor/get-all-contractors-and-users?search=${
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

export const getContractorDetailById = createAsyncThunk(
  'getContractorDetailById',
  async ({id, type}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/contractor/get-contractors-and-users-details/${id}/${type}`,
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
export const createContractor = createAsyncThunk(
  'createContractor',
  async values => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/contractor/create-complaint-sub-type?action=created&module_id=5&sub_module_id=12`,
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
export const deleteContractorById = createAsyncThunk(
  'deleteContractorById',
  async Id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/contractor/delete-contractors-and-users/${Id}/Contractor?module_id=4&action=deleted`,
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

export const deleteContractorUserById = createAsyncThunk(
  'deleteContractorUserById',
  async Id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/contractor/delete-contractors-and-users/${Id}/User`,
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

export const updatContractorById = createAsyncThunk(
  'updatContractorById',
  async requestbody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/contractor/update-complaint-sub-types-details?action=updated&module_id=5&sub_module_id=12`,
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

const getAllContractorListSlice = createSlice({
  name: 'allContractor',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(allContractorList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(allContractorList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(allContractorList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAllContractorListSlice.reducer;
