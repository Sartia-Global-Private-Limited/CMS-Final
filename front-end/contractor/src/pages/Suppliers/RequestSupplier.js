import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Helmet } from "react-helmet";
import {
  approveRejectSupplierById,
  deleteSuppliersById,
  getAllSuppliers,
} from "../../services/contractorApi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import StatusChip from "../../components/StatusChip";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { serialNumber } from "../../utils/helper";
import { useTranslation } from "react-i18next";

const RequestSupplier = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [supllierId, setSupllierId] = useState("");

  const fetchSuppliersData = async () => {
    const isDropdown = "false";
    const status = "1";
    const res = await getAllSuppliers({
      search,
      pageSize,
      pageNo,
      isDropdown,
      status,
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

  const handleApproveReject = async () => {
    const status = showApprove ? "2" : "3";
    const res = await approveRejectSupplierById(status, supllierId);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== supllierId));
      fetchSuppliersData();
    } else {
      toast.error(res.message);
    }
    setSupllierId("");
    setShowApprove(false);
    setShowReject(false);
  };

  const handleDelete = async () => {
    const res = await deleteSuppliersById(supllierId);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== supllierId));
    } else {
      toast.error(res.message);
    }
    setSupllierId("");
    setShowDelete(false);
  };

  useEffect(() => {
    fetchSuppliersData();
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
      columnHelper.accessor("supplier_name", {
        header: "supplier name",
        cell: (info) => (
          <div>
            <Link
              className="text-secondary text-none"
              to={`/Suppliers/create-supplier/${info.row.original.id}?type=view`}
            >
              {info.row.original.supplier_name}
            </Link>
          </div>
        ),
      }),
      columnHelper.accessor("owner_name", {
        header: "owner name",
      }),
      columnHelper.accessor("cashier_name", {
        header: "cashier name",
      }),
      columnHelper.accessor("supplier_code", {
        header: "supplier code",
      }),
      columnHelper.accessor("bank_name", {
        header: "bank name",
      }),
      columnHelper.accessor("account_number", {
        header: "account name",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={info.row.original.status} />,
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
                    `/Suppliers/create-supplier/${info.row.original.id}?type=view`
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/Suppliers/create-supplier/${info.row.original.id}`
                  ),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setSupllierId(info.row.original.id);
                  setShowDelete(true);
                },
              },
              approve: {
                show: checkPermission?.update,
                action: () => {
                  setSupllierId(info.row.original.id);
                  setShowApprove(true);
                },
              },
              reject: {
                show: checkPermission?.update,
                action: () => {
                  setSupllierId(info.row.original.id);
                  setShowReject(true);
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
      <Helmet>
        <title>Suppliers · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CustomTable
          id={"request_supplier"}
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
                noDrop: true,
                to: `/Suppliers/create-supplier/new`,
                title: "Create",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>Awaiting supplier</strong>
            </div>
          }
        />
        <ConfirmAlert
          size={"sm"}
          deleteFunction={handleDelete}
          hide={setShowDelete}
          show={showDelete}
          title={"Confirm Delete"}
          description={"Are you sure you want to delete this!!"}
        />
        <ConfirmAlert
          size={"sm"}
          deleteFunction={handleApproveReject}
          hide={setShowApprove}
          show={showApprove}
          title={"Confirm Approve"}
          description={"Are you sure you want to approve this!!"}
        />

        <ConfirmAlert
          size={"sm"}
          deleteFunction={handleApproveReject}
          hide={setShowReject}
          show={showReject}
          title={"Confirm reject"}
          description={"Are you sure you want to reject this!!"}
        />
      </Col>
    </>
  );
};

export default RequestSupplier;
