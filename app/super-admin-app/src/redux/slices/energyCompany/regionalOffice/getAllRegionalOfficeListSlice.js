import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/* action name  to be called from ui using dispatch */

export const allRegionalOfficeList = createAsyncThunk(
  'allRegionalOfficeList',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/regional-office/all-regional-offices?search=${
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

export const getRegionalDetailById = createAsyncThunk(
  'getRegionalDetailById',
  async Id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/regional-office/get-regional-office-by-id/${Id}`,
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
export const createRegionalOffice = createAsyncThunk(
  'createRegionalOffice',
  async values => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/regional-office/create-regional-office?module_id=4&sub_module_id=15&action=created`,
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
export const deleteRegionalOfficeById = createAsyncThunk(
  'deleteRegionalOfficeById',
  async Id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/regional-office/delete-regional-office/${Id}?module_id=4&sub_module_id=15&action=deleted`,
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

export const updateRegionalOfficeById = createAsyncThunk(
  'updateRegionalOfficeById',
  async requestbody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/regional-office/update-regional-office?module_id=4&sub_module_id=15&action=updated`,
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

const getallRegionalOfficeListSlice = createSlice({
  name: 'allRegionalOffice',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(allRegionalOfficeList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(allRegionalOfficeList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(allRegionalOfficeList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getallRegionalOfficeListSlice.reducer;
