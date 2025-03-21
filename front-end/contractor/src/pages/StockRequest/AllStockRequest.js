import React, { useEffect, useMemo, useState } from "react";
import ActionButton from "../../components/ActionButton";
import { Badge, Form, Table } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { getAllStockRequest } from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import { useTranslation } from "react-i18next";
import { UserDetail } from "../../components/ItemDetail";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { UserPlus } from "lucide-react";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { serialNumber } from "../../utils/helper";

const AllStockRequest = ({ checkPermission }) => {
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

  const fetchStockAllData = async () => {
    const res = await getAllStockRequest(search, pageSize, pageNo);
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
    fetchStockAllData();
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
        cell: (info) => (
          <td
            className={
              info.row.original.status === "Rejected"
                ? `text-danger`
                : info.row.original.status === "Approved"
                ? "text-green"
                : info.row.original.status === "Pending"
                ? "text-orange"
                : info.row.original.status === "Done"
                ? "text-green"
                : "text-orange"
            }
          >
            {info.row.original.status}
          </td>
        ),
      }),
      columnHelper.accessor("request_date", {
        header: "request date",
      }),
      columnHelper.accessor("total_request_qty", {
        header: "request qty",
        cell: (info) => (
          <div
            className={`fw-bolder text-${
              info.row.original.total_request_qty > 0 ? "green" : "danger"
            }`}
          >
            {info.row.original.total_request_qty > 0
              ? info.row.original.total_request_qty
              : "0"}
          </div>
        ),
      }),
      columnHelper.accessor("supplier_name", {
        header: "supplier name",
      }),
      columnHelper.accessor("total_request_items", {
        header: "total item",
        cell: (info) => (
          <>
            <Badge bg="orange" className="fw-normal" style={{ fontSize: 11 }}>
              {info.row.original.total_request_items} {t("old")}
            </Badge>
            &ensp;
            <Badge
              bg="secondary"
              className="fw-normal"
              style={{ fontSize: 11, marginTop: "5px" }}
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
                    `/stock-request/create-stock-request/${info.row.original.id}?type=view`
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
        id={"all_request"}
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
            <UserPlus /> <strong>All Request</strong>
          </div>
        }
      />
    </>
  );
};

export default AllStockRequest;
