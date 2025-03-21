import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../../config';

/* action name  to be called from ui using dispatch */

export const allSalesAreaList = createAsyncThunk(
  'allSalesAreaList',
  async ({search, pageSize, pageNo}) => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/sales-area/sales-area?search=${
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

export const getSalesAreaDetailById = createAsyncThunk(
  'getSalesAreaDetailById',
  async Id => {
    try {
      const {data} = await customApi.get(
        `/api/super-admin/sales-area/get-sales-area-by-id/${Id}`,
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
export const createSalesArea = createAsyncThunk(
  'createSalesArea',
  async values => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/sales-area/add-sales-area?module_id=4&sub_module_id=16&action=created`,
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
export const deleteSalesAreaById = createAsyncThunk(
  'deleteSalesAreaById',
  async Id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/sales-area/delete-sales-area/${Id}?module_id=4&sub_module_id=16&action=deleted`,
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

export const updateSalesAreaById = createAsyncThunk(
  'updateSalesAreaById',
  async requestbody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/sales-area/update-sales-area?module_id=4&sub_module_id=16&action=updated`,
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

const getallSalesAreaListSlice = createSlice({
  name: 'allSalesArea',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(allSalesAreaList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(allSalesAreaList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(allSalesAreaList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getallSalesAreaListSlice.reducer;
