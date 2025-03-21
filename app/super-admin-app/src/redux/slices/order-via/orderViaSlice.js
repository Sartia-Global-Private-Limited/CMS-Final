import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/* api for get oreder via Listing*/
export const orderViaList = createAsyncThunk('orderViaList', async () => {
  try {
    const {data} = await customApi.get(
      `/api/super-admin/master-data/order-via/get-all-order`,
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
});

/* api for get oreder via deatila by id*/
export const getorderViaDetailById = createAsyncThunk(
  'getorderViaDetailById',
  async Id => {
    try {
      const {data} = await customApi.get(
        `api/super-admin/master-data/order-via/get-order-by-id/${Id}`,
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
export const createOrderVia = createAsyncThunk(
  'createOrderVia',
  async values => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/master-data/order-via/create-order`,
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
export const deleteOrderViaById = createAsyncThunk(
  'deleteOrderViaById',
  async Id => {
    try {
      const {data} = await customApi.delete(
        `/api/super-admin/master-data/order-via/delete-order/${Id}`,
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

export const updatOrderViaById = createAsyncThunk(
  'updatOrderViaById',
  async requestbody => {
    try {
      const {data} = await customApi.post(
        `/api/super-admin/master-data/order-via/update-order`,
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

const orderViaSlice = createSlice({
  name: 'orderVia',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    /*  for pending state*/
    builder.addCase(orderViaList.pending, (state, action) => {
      state.isLoading = true;
    });

    /*  for fulfilled state*/
    builder.addCase(orderViaList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });

    /*  for rejected state*/
    builder.addCase(orderViaList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default orderViaSlice.reducer;
