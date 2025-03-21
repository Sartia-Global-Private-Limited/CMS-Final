import React, { useEffect, useMemo, useState } from "react";
import { getAllStockPunchRequest } from "../../services/contractorApi";
import { useDebounce } from "../../hooks/UseDebounce";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { UserDetail } from "../../components/ItemDetail";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import { serialNumber } from "../../utils/helper";
import { useTranslation } from "react-i18next";

const StockPunchRequest = ({ checkPermission }) => {
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
  const { user } = useSelector(selectUser);
  const { t } = useTranslation();
  const fetchStockRequestData = async () => {
    const res = await getAllStockPunchRequest(search, pageSize, pageNo);
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

  const debounceValue = useDebounce(search, 500);
  useEffect(() => {
    fetchStockRequestData();
  }, [debounceValue, pageNo, pageSize]);

  // to change the format of date
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
        header: "employee id",
      }),
      columnHelper.accessor("name", {
        header: "user name",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.image}
            name={info.row.original?.name}
            id={info.row.original?.id}
            unique_id={info.row.original?.employee_id}
            login_id={user.id}
          />
        ),
      }),
      columnHelper.accessor("totalPunch", {
        header: "total complaint ",
      }),
      columnHelper.accessor("totalSum", {
        header: "total amount ",
        cell: (info) => (
          <div className="text-green">
            {" "}
            ₹ {info.row.original.totalSum ?? "0"}
          </div>
        ),
      }),
      columnHelper.accessor("total_stock_amount", {
        header: "transfer stock amount ",
        cell: (info) => (
          <div className="text-green">
            ₹ {info.row.original.total_stock_amount ?? "0"}
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
        header: "requested month",
        cell: (info) => getDate(info.row.original.month),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(
                    `/view-stock-punch-request/${info.row.original.id}?type=view`
                  ),
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
        id={"stock_punch_request"}
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
            button={{
              show: false,
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>stock punch request</strong>
          </div>
        }
      />
    </>
  );
};

export default StockPunchRequest;
