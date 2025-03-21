import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/* action name  to be called from ui using dispatch */

export const allDistrictList = createAsyncThunk(
  'allDistrictList',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/district/all-districts?search=${
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

export const getDistrictDetailById = createAsyncThunk(
  'getDistrictDetailById',
  async Id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/district/get-district-by-id/${Id}`,
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
export const createDistrict = createAsyncThunk(
  'createDistrict',
  async values => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/district/add-district?module_id=4&sub_module_id=17&action=created`,
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
export const deleteDistrictById = createAsyncThunk(
  'deleteDistrictById',
  async Id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/district/delete-district/${Id}?module_id=4&sub_module_id=16&action=deleted`,
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

export const updateDistrictById = createAsyncThunk(
  'updateDistrictById',
  async requestbody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/district/update-district?module_id=4&sub_module_id=17&action=updated`,
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

const getallDistrictListSlice = createSlice({
  name: 'allDistrict',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(allDistrictList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(allDistrictList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(allDistrictList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getallDistrictListSlice.reducer;
