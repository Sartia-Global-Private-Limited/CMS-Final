import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "react-bootstrap";
import { getRejectedFundRequest } from "../../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { UserDetail } from "../../../components/ItemDetail";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { createColumnHelper } from "@tanstack/react-table";
import { RotateCcw, UserPlus } from "lucide-react";
import StatusChip from "../../../components/StatusChip";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { formatNumberToINR, serialNumber } from "../../../utils/helper";

const RejectedFundRequest = ({ checkPermission }) => {
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

  const fetchFundRejectedData = async () => {
    const res = await getRejectedFundRequest(search, pageSize, pageNo);
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
    fetchFundRejectedData();
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
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={"rejected"} />,
      }),
      columnHelper.accessor("request_date", {
        header: "request date",
      }),
      columnHelper.accessor("total_approved_amount", {
        header: "Request amount",
        cell: (info) => (
          <td
            className={`fw-bolder text-${
              info.row.original.total_request_amount > 0 ? "green" : "danger"
            }`}
          >
            {formatNumberToINR(info.row.original.total_request_amount)}
          </td>
        ),
      }),
      columnHelper.accessor("approved_by", {
        header: "approved by ",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.rejected_by_image}
            name={info.row.original?.rejected_by}
            login_id={user?.id}
            id={info.row.original?.request_by_id}
            unique_id={info.row.original?.rejected_by_employee_id}
          />
        ),
      }),
      columnHelper.accessor("total_request_items", {
        header: "Total Item",
        cell: (info) => (
          <>
            <Badge bg="orange" className="fw-normal" style={{ fontSize: 11 }}>
              {info.row.original.total_request_items} {t("old")}
            </Badge>
            &ensp;
            <Badge
              bg="secondary"
              className="fw-normal"
              style={{ fontSize: 11 }}
            >
              {info.row.original.total_new_request_items} {t("new")}
            </Badge>
          </>
        ),
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
                    `/fund-request/create-fund-request/${info.row.original.id}?type=view`
                  ),
              },
              reject: {
                show: checkPermission?.update,
                icon: RotateCcw,
                tooltipTitle: "Re-Active",
                align: "left",
                action: () => {
                  navigate(
                    `/fund-request/create-fund-request/${info.row.original.id}?type=reject`
                  );
                },
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
        id={"rejected_fund_request"}
        isLoading={isLoading}
        userPermission={checkPermission}
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
            <UserPlus /> <strong>Rejected Fund Request</strong>
          </div>
        }
        // hideCol={[
        //   !userPermission?.update && !userPermission?.delete ? "action" : "",
        // ]}
      />
    </>
  );
};

export default RejectedFundRequest;
