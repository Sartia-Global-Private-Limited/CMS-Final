import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/* action name  to be called from ui using dispatch */

export const allUserEnergyCompanyList = createAsyncThunk(
  'allUserEnergyCompanyList',
  async () => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/energy-company/get-all-energy-company-with-soft-delete`,
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

export const updateUserEnergyCompany = createAsyncThunk(
  'updateUserEnergyCompany',
  async body => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/update-energy-company-details?module_id=4&sub_module_id=13&action=updated`,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
        body,
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

export const createUserEnergyCompany = createAsyncThunk(
  'createUserEnergyCompany',
  async body => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/energy-company/create-energy-company?module_id=4&sub_module_id=13&action=created`,
        body,
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
  },
);

export const deleteUserEnergyCompany = createAsyncThunk(
  'deleteUserEnergyCompany',
  async body => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/energy-company/delete-related-data-for-energy-company?module_id=4&sub_module_id=13&action=deleted`,
        body,
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

export const assignUserEnergyCompany = createAsyncThunk(
  'assignUserEnergyCompany',
  async ({body, id}) => {
    // return console.log('Hii assignUserEnergyCompany');
    try {
      const {data} = await customApi.post(
        `/api/super-admin/energy-company/energy-company-delete/${id}`,
        body,
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

export const addUserEnergyCompany = createAsyncThunk(
  'addUserEnergyCompany',
  async body => {
    // return console.log('Hii addUserEnergyCompany');
    try {
      const {data} = await customApi.post(
        `/api/super-admin/energy-company/create-zone-user`,
        body,
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

export const EnergyCompanyDetails = createAsyncThunk(
  'EnergyCompanyDetails',
  async id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/energy-company/get-energy-company-details/${id}`,
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

const getAllUserEnergyCompanySlice = createSlice({
  name: 'getAllECUserList',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(allUserEnergyCompanyList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(allUserEnergyCompanyList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(allUserEnergyCompanyList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAllUserEnergyCompanySlice.reducer;
