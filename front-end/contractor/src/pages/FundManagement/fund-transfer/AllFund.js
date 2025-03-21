import React, { useEffect, useMemo, useState } from "react";
import { Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import ReactPagination from "../../../components/ReactPagination";
import { getAllTransferFundRequest } from "../../../services/contractorApi";
import { Helmet } from "react-helmet";
import ActionButton from "../../../components/ActionButton";
import { useTranslation } from "react-i18next";
import ExportExcelPdf from "../../../components/ExportExcelPdf";
import { UserDetail } from "../../../components/ItemDetail";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import StatusChip from "../../../components/StatusChip";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { formatNumberToINR, serialNumber } from "../../../utils/helper";

const AllFund = ({ checkPermission }) => {
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

  const fetchTransferedFundData = async () => {
    const res = await getAllTransferFundRequest({
      search,
      pageSize,
      pageNo,
    });
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
    fetchTransferedFundData();
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
      columnHelper.accessor("total_transfer_amount", {
        header: "Transferred amount",
        cell: (info) => (
          <div
            className={`fw-bolder text-${
              info.row.original.total_transfer_amount > 0 ? "green" : "danger"
            }`}
          >
            {formatNumberToINR(info.row.original.total_transfer_amount)}
          </div>
        ),
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
                    `/fund-request/create-fund-request/${info.row.original.id}?type=view`
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
        id={"transferred_fund"}
        userPermission={checkPermission}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        excelAction={() => ""}
        pdfAction={() => ""}
        apiForExcelPdf={getAllTransferFundRequest}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{ show: false }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>transferred Fund</strong>
          </div>
        }
      />
    </>
  );
};

export default AllFund;
