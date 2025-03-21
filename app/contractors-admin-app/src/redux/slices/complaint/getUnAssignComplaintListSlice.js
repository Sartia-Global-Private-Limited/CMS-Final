/*    ----------------Created Date :: 12 - Feb -2024   ----------------- */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customApi } from '../../../../config';

/* action name  to be called from ui using dispatch */

export const unAssignComplaintList = createAsyncThunk(
  'unAssignComplaintList ',
  async ({
    isDropdown = false,
    search = '',
    pageSize = 10,
    pageNo = 1,
    sales_area_id = '',
    outlet_id = '',
    regional_office_id = '',
    order_by_id = '',
    company_id = '',
    complaint_for = '',
  }) => {
    try {
      const { data } = isDropdown
        ? await customApi.get(
            `/api/contractor/complaints/get-all-approved-un-assign-complaints?isDropdown=${isDropdown}`,
          )
        : await customApi.get(
            `/api/contractor/complaints/get-all-approved-un-assign-complaints?search=${search}&pageSize=${pageSize}&pageNo=${pageNo}&sales_area_id=${sales_area_id}&outlet_id=${outlet_id}&regional_office_id=${regional_office_id}&order_by_id=${order_by_id}&company_id=${company_id}&complaint_for=${complaint_for}`,
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

const getUnAssignComplaintListSlice = createSlice({
  name: 'getUnAssignComplaintList', //to be use in ui for fetching data from store by     useSelector (state=> state.nameOfReducer)
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },

  extraReducers: builder => {
    builder.addCase(unAssignComplaintList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(unAssignComplaintList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.data = action.payload;
    });
    builder.addCase(unAssignComplaintList.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});

export default getUnAssignComplaintListSlice.reducer;
