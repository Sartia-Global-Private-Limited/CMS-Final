import React, { useEffect, useMemo, useState } from "react";
import { getAllExpenseRequest } from "../../services/contractorApi";
import { useDebounce } from "../../hooks/UseDebounce";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import { serialNumber } from "../../utils/helper";
import { Form } from "react-bootstrap";
import moment from "moment";

const ExpenseRequest = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [yearMonth, setYearMonth] = useState(
    moment(new Date()).format("YYYY-MM") || ""
  );

  const handleMonthChange = (event) => {
    setYearMonth(event.target.value);
  };

  const fetchStockRequestData = async () => {
    const res = await getAllExpenseRequest({
      yearMonth,
      search,
      pageSize,
      pageNo,
    });
    setIsLoading(true);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  // set Delay time to get data on search
  const debounceValue = useDebounce(search, 500);

  useEffect(() => {
    fetchStockRequestData();
  }, [yearMonth, debounceValue, pageNo, pageSize]);

  const getDate = (inputDate) => {
    const [year, month] = inputDate.split("-");
    const date = new Date(`${month}-01-${year}`);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);

    return formattedDate;
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("employee_id", {
        header: "Employee ID",
      }),
      columnHelper.accessor("name", {
        header: "User name",
      }),
      columnHelper.accessor("complaint_unique_id", {
        header: "complaint number",
      }),
      columnHelper.accessor("totalPunch", {
        header: "total complaint punch",
      }),
      columnHelper.accessor("totalSum", {
        header: "total Amount",
        cell: (info) => (
          <div className="text-green"> ₹ {info.row.original.totalSum}</div>
        ),
      }),
      columnHelper.accessor("total_expense_amount", {
        header: "transfer Amount",
        cell: (info) => (
          <div className="text-green">
            {" "}
            ₹ {info.row.original.total_expense_amount}
          </div>
        ),
      }),
      columnHelper.accessor("balance", {
        header: "balance",
        cell: (info) => (
          <div className="text-green"> ₹ {info.row.original.balance}</div>
        ),
      }),
      columnHelper.accessor("month", {
        header: "Requested month",
        cell: (info) => {
          return getDate(info.row.original.month);
        },
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/view-expense-request/${info.row.original.id}`),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <CustomTable
        id={"expense_request"}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{ show: false }}
            extraComponent={
              <Form.Control
                type="month"
                value={yearMonth}
                onChange={handleMonthChange}
              />
            }
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>expense request</strong>
          </div>
        }
      />
    </>
  );
};

export default ExpenseRequest;
