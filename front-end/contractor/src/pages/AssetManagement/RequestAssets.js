import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import {
  approveRejectAssetsManagementById,
  deleteAssetsById,
  getAllAssets,
} from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { getAllUsers } from "../../services/authapi";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import StatusChip from "../../components/StatusChip";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { serialNumber } from "../../utils/helper";

const RequestAssets = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const { userPermission } = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [assestsId, setAssestsId] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [assignUserData, setAssignUserData] = useState([]);

  const fetchAllAssetsData = async () => {
    const status = 1;
    const isDropdown = false;
    const res = await getAllAssets({
      search,
      pageSize,
      pageNo,
      isDropdown,
      status,
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

  const handleDelete = async () => {
    const res = await deleteAssetsById(assestsId);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((dlt) => dlt.id !== assestsId));
      fetchAllAssetsData();
    } else {
      toast.error(res.message);
    }
    setAssestsId("");
    setShowDelete(false);
  };
  const handleApproveReject = async () => {
    const status = showApprove ? "2" : "3";
    const res = await approveRejectAssetsManagementById(status, assestsId);

    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== assestsId));
      setPageDetail({
        ...pageDetail,
        total: +pageDetail.total - 1,
        pageEndResult: pageDetail.pageEndResult - 1,
      });
    } else {
      toast.error(res.message);
    }

    setAssestsId("");
    setShowApprove(false);
    setShowReject(false);
  };

  const fetchAssignUserData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAssignUserData(res.data);
    } else {
      setAssignUserData([]);
    }
  };

  useEffect(() => {
    fetchAllAssetsData();
    fetchAssignUserData();
  }, [search, pageNo, pageSize]);

  const UserOption = ({ innerProps, label, data }) => (
    <div
      {...innerProps}
      className="d-flex justify-content-between px-2 align-items-center cursor-pointer"
    >
      <span>
        <img
          className="avatar me-2"
          src={
            data.image ||
            `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
          alt={data.name}
        />
        {label}
      </span>
    </div>
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("asset_name", {
        header: "asset name",
      }),
      columnHelper.accessor("asset_model_number", {
        header: "asset model number",
      }),
      columnHelper.accessor("asset_uin_number", {
        header: "asset uin number",
      }),
      columnHelper.accessor("asset_price", {
        header: "asset price",
      }),
      columnHelper.accessor("asset_purchase_date", {
        header: "purchase date",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={"requested"} />,
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
                    `/AllAssets/CreateAssets/${info.row.original.id}?type=view`
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/AllAssets/CreateAssets/${info.row.original.id}`),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setAssestsId(info.row.original.id);
                  setShowDelete(true);
                },
              },
              approve: {
                show: true,
                action: () => {
                  setAssestsId(info.row.original.id);
                  setShowApprove(true);
                },
              },
              reject: {
                show: true,
                action: () => {
                  setAssestsId(info.row.original.id);
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
      <Col md={12} data-aos={"fade-up"}>
        <Helmet>
          <title>All Request Assets · CMS Electricals</title>
        </Helmet>
        <CustomTable
          id={"request_assets"}
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
                to: `/AllAssets/CreateAssets/new`,
                title: "Create Assets",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>Requested assets</strong>
            </div>
          }
        />
      </Col>
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
    </>
  );
};

export default RequestAssets;
