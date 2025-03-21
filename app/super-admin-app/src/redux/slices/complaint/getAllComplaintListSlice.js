import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {customApi} from '../../../../config';

/* action name  to be called from ui using dispatch */

export const allComplaintList = createAsyncThunk(
  'allComplaintList ',
  async ({
    isDropdown = false,
    search = '',
    pageSize = 10,
    pageNo = 1,
    sales_area_id = '',
    outlet_id = '',
    regional_office_id = '',
    order_by_id = '',
    area_manager_id = '',
    supervisor_id = '',
    end_user_id = '',
    company_id = '',
    complaint_for = '',
  }) => {
    try {
      const {data} = isDropdown
        ? await customApi.get(
            `/api/super-admin/complaints/get-all-complaints?isDropdown=${isDropdown}`,
          )
        : await customApi.get(
            `/api/super-admin/complaints/get-all-complaints?search=${search}&pageSize=${pageSize}&pageNo=${pageNo}&sales_area_id=${sales_area_id}&outlet_id=${outlet_id}&regional_office_id=${regional_office_id}&order_by_id=${order_by_id}&area_manager_id=${area_manager_id}&supervisor_id=${supervisor_id}&end_user_id=${end_user_id}&company_id=${company_id}&complaint_for=${complaint_for}`,
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

const getAllComplaintListSlice = createSlice({
  name: 'getAllComplaintList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(allComplaintList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(allComplaintList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(allComplaintList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getAllComplaintListSlice.reducer;
