import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/* action name  to be called from ui using dispatch */

export const allZoneList = createAsyncThunk(
  'allZoneList',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/zone/all-zone?search=${search || ''}&pageSize=${
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

export const getZoneDetailById = createAsyncThunk(
  'getZoneDetailById',
  async Id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/zone/get-zone-by-id/${Id}`,
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
export const createZone = createAsyncThunk('createZone', async values => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/zone/create-zone?module_id=4&sub_module_id=14&action=created`,
      values,
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
export const deleteZoneById = createAsyncThunk('deleteZoneById', async Id => {
  try {
    const {data} = await customApi.delete(
      `/api/super-admin/zone/delete-zone/${Id}`,
    );

    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/* api for updating oreder via deatail*/

export const updateZoneById = createAsyncThunk(
  'updateZoneById',
  async requestbody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/zone/update-zone?module_id=4&sub_module_id=14&action=updated`,
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

const getAllZoneListSlice = createSlice({
  name: 'allZone',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(allZoneList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(allZoneList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(allZoneList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAllZoneListSlice.reducer;
