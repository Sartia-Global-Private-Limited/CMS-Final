import {createSlice, createAsyncThunk, isAction} from '@reduxjs/toolkit';
import {customApi} from '../../../config';

export const getAllRolesForSuperAdmin = createAsyncThunk(
  'getAllRolesForSuperAdmin',
  async ({search = '', pageNo = 1, pageSize = 8}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/roles-permission/roles?search=${search}&&pageSize=${pageSize}&&pageNo=${pageNo}`,
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

export const deleteRolesForSuperAdmin = createAsyncThunk(
  'deleteRolesForSuperAdmin',
  async id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/roles-permission/delete-role/${id}?module_id=13&sub_module_id=48&action=deleted`,
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

export const updateRolesById = createAsyncThunk(
  'updateRolesById',
  async requestbody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/roles-permission/update-role?module_id=13&sub_module_id=48&action=updated`,
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
export const createRole = createAsyncThunk('createRole', async values => {
  try {
    const {data} = await customApi.post(
      `/api/super-admin/roles-permission/create-role?module_id=13&sub_module_id=48&action=create`,
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

const allRolesSlice = createSlice({
  name: 'allRoles', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*  for pending state*/
    builder.addCase(getAllRolesForSuperAdmin.pending, (state, action) => {
      state.isLoading = true;
    });

    /*  for fulfilled state*/
    builder.addCase(getAllRolesForSuperAdmin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });

    /*  for rejected state*/
    builder.addCase(getAllRolesForSuperAdmin.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default allRolesSlice.reducer;
