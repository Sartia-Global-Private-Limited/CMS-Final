import React, { useEffect, useMemo, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { BsArrowLeftRight, BsPlus, BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import ReactPagination from "../../../components/ReactPagination";
import {
  getAllPendingTransferFundRequest,
  postRejectFundRequest,
} from "../../../services/contractorApi";
import ActionButton from "../../../components/ActionButton";
import "react-best-tabs/dist/index.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ImageViewer from "../../../components/ImageViewer";
import TooltipComponent from "../../../components/TooltipComponent";
import { getAllRescheduledTransfer } from "../../../services/contractoApi2";
import { useTranslation } from "react-i18next";
import {
  formatNumberToINR,
  getDateValue,
  serialNumber,
} from "../../../utils/helper";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { UserDetail } from "../../../components/ItemDetail";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import StatusChip from "../../../components/StatusChip";
import { createColumnHelper } from "@tanstack/react-table";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import CustomTable from "../../../components/DataTable/CustomTable";

export default function RescheduledTransfer({ checkPermission }) {
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const { user } = useSelector(selectUser);

  const getRescheduledTransferFund = async () => {
    const res = await getAllRescheduledTransfer(search, pageSize, pageNo);
    setIsLoading(true);
    if (res.status) {
      setRows(res?.data);
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
      columnHelper.accessor("total_request_amount", {
        header: "request amount",
        cell: (info) => (
          <div
            className={`fw-bolder text-${
              info.row.original.total_request_amount > 0 ? "green" : "danger"
            }`}
          >
            {formatNumberToINR(info.row.original.total_request_amount)}
          </div>
        ),
      }),
      columnHelper.accessor("total_approved_amount", {
        header: "total approved amount",
        cell: (info) => (
          <div
            className={`fw-bolder text-${
              info.row.original.total_approved_amount > 0 ? "green" : "danger"
            }`}
          >
            {formatNumberToINR(info.row.original.total_approved_amount)}
          </div>
        ),
      }),
      columnHelper.accessor("reschedule_date", {
        header: "Rescheduled date",
        cell: (info) => getDateValue(info.row.original.reschedule_date),
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={info.row.original.status} />,
      }),
      columnHelper.accessor("action", {
        header: "action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(
                    `/fund-transfer/create-fund-transfer/${info.row.original.id}?type=view`
                  ),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, t, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <CustomTable
        id={"reschedule_fund_transfer"}
        userPermission={checkPermission}
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
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>Reschedule Fund Transfer</strong>
          </div>
        }
      />
    </>
  );
}
