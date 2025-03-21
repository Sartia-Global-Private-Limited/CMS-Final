import { QUERY_PARAMS } from "../utils/helper";
import { customApi } from "./authapi";

customApi.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("cms-ca-token");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// API's For FUND MANAGEMENT MODULE

export const getAllRescheduledTransfer = async (search, pageSize, pageNo) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/fund/fund-transfer/rescheduled-transfer-fund?search=${search}&&pageSize=${
        pageSize || ""
      }&&pageNo=${pageNo || ""}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postRescheduledTransferFund = async (id, rescheduled_date) => {
  try {
    const { data } = await customApi.put(
      `/api/contractor/fund/fund-transfer/rescheduled-transfer-fund/${id}/${rescheduled_date}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const postFundTransferRequest = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/fund/fund-transfer/transfer-fund`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// FUND BALANCE

export const getAllAccountTransactions = async (
  id,
  module,
  module_type,
  params
) => {
  try {
    console.log("module_type", module_type);
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/${module}/${module_type}/get-check-last-balance/${id}?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getLastBalanceOfEmployee = async (
  employee_id,
  module,
  module_type,
  params
) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/${module}/${module_type}/get-check-last-balance-of-employee/${employee_id}?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

//  FUND TRANSACTION

export const getAllAccountTransactionsByBank = async (
  id,
  typeselect,
  module_type,
  params
) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/${typeselect}/${module_type}/get-bank-to-all-accounts-transaction/${id}/${typeselect}?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getFundTransactionsOfEmployee = async (
  employee_id,
  module,
  module_type,
  params
) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/${module}/${module_type}/get-user-transaction/${employee_id}?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

//  EMPLOYEE LIST

export const getEmployeeList = async (
  employeeType,
  pageSize,
  pageNo,
  search
) => {
  try {
    let res;
    if (employeeType === "manager") {
      res = await customApi.get(`/api/contractor/get-all-managers-users`);
    }

    if (employeeType === "supervisor") {
      res = await customApi.get(`/api/contractor/get-all-supervisors`);
    }

    if (employeeType === "enduser") {
      res = await customApi.get(`/api/contractor/get-all-users`);
    }

    return res.data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// API'S FOR EXPENSE MANAGEMENT MODULE

export const expenseBalanceOverview = async (
  employee_id,
  module,
  module_type,
  params
) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/${module}/${module_type}/get-last-balance-of-employee-in-expense/${employee_id}?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getExpenseTransactionDetails = async (
  employee_id,
  module,
  module_type,
  params
) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/${module}/${module_type}/get-expense-transaction-in-expense/${employee_id}?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const getExpenseTransactionDetailsInStockPunch = async (
  employee_id,
  params
) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/stock-punch/stock-punch-transaction/get-expense-transaction-in-stock-punch/${employee_id}?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getTransactionDetail = async (id, onClickStatus) => {
  try {
    const { data } = await customApi.get(
      `/api/contractor/get-expense-transaction/${id}?onclick=${onClickStatus}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

// API'S FOR STOCK MANAGEMENT MODULE

export const postStockTransferRequest = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/stock/transfer-stock/stock-transfer`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const updateStockTransferRequest = async (values) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/stock/transfer-stock/update-transfer-bill-and-date`,
      values
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
export const postRescheduledTransferStock = async (id, rescheduled_date) => {
  try {
    const { data } = await customApi.post(
      `/api/contractor/stock/transfer-stock/rescheduled-stocks-transfer-stock/${id}/${rescheduled_date}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};

export const getStockTransactionOfSupplier = async (employee_id, params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/stock/get-supplier-transaction/${employee_id}?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

export const expenseBalanceOverviewInStockPunch = async (
  employee_id,
  params
) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/stock-punch/stock-punch-balance/get-last-balance-of-employee-in-stock-punch/${employee_id}?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data.message || error.message,
    };
  }
};

// PREVIOUS API'S

export const getAllRescheduledStockTransfer = async (params) => {
  try {
    const queryParams = QUERY_PARAMS(params);
    const { data } = await customApi.get(
      `/api/contractor/get-reschdule-transfer-stock?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      status: false,
      message: error.response.data.message || error.message,
    };
  }
};
