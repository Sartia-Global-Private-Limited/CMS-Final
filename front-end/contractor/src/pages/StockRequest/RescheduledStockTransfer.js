import React, { useEffect, useMemo, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { BsArrowLeftRight, BsSearch } from "react-icons/bs";
import ActionButton from "../../components/ActionButton";
import "react-best-tabs/dist/index.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import TooltipComponent from "../../components/TooltipComponent";
import { getAllRescheduledStockTransfer } from "../../services/contractoApi2";
import ReactPagination from "../../components/ReactPagination";
import { useTranslation } from "react-i18next";
import { getDateValue } from "../../utils/helper";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { UserDetail } from "../../components/ItemDetail";
import { createColumnHelper } from "@tanstack/react-table";
import StatusChip from "../../components/StatusChip";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { serialNumber } from "../../utils/helper";
export default function RescheduledStockTransfer({ checkPermission }) {
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

  const getRescheduledTransferFund = async () => {
    const res = await getAllRescheduledStockTransfer({
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

  useEffect(() => {
    getRescheduledTransferFund();
  }, [search, pageNo, pageSize]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("unique_id", {
        header: "Unique ID",
      }),
      columnHelper.accessor("request_for", {
        header: "Request For",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.request_for_image}
            name={info.row.original?.request_for}
            login_id={user?.id}
            id={info.row.original?.request_for_id}
            unique_id={info.row.original?.request_for_employee_id}
          />
        ),
      }),
      columnHelper.accessor("request_date", {
        header: "request date",
      }),
      columnHelper.accessor("request_stock_quantity", {
        header: "request quantity",
        cell: (info) => (
          <div className={`fw-bolder text-danger`}>
            {info.row.original?.request_stock_quantity}
          </div>
        ),
      }),
      columnHelper.accessor("approve_stock_quantity", {
        header: "approved quantity",
        cell: (info) => (
          <div className={`fw-bolder text-green`}>
            {info.row.original?.approve_stock_quantity}
          </div>
        ),
      }),
      columnHelper.accessor("reschedule_date", {
        header: "reschedule date",
        cell: (info) => getDateValue(info.row.original.reschedule_date),
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={info.row.original?.status} />,
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
                    `/stock-request/create-stock-request/${info.row.original.id}?type=view`
                  ),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, rows.length, , pageNo, pageSize]
  );

  return (
    <>
      <CustomTable
        id={"reschedule_stock"}
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
            <UserPlus /> <strong>Rescheduled stock</strong>
          </div>
        }
      />
    </>
  );
}
