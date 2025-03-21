import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import {
  deleteWorkImagesById,
  getAllWorkImages,
  approveRejectWorkImageById,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../components/DataTable/ActionButtons";
import StatusChip from "../../components/StatusChip";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { FileText } from "lucide-react";
import { UserDetail } from "../../components/ItemDetail";
import { findMatchingPath, serialNumber } from "../../utils/helper";

const RequestWorkImages = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userPermission, user } = useSelector(selectUser);
  const { t } = useTranslation();
  const [showDelete, setShowDelete] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [workImageId, setWorkImageId] = useState("");
  const [matchingPathObject, setMatchingPathObject] = useState(null);

  const fetchWorkImagesData = async () => {
    const status = 1;
    const res = await getAllWorkImages({ search, pageSize, pageNo, status });
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

  const handleDelete = async () => {
    const res = await deleteWorkImagesById(workImageId);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((dlt) => dlt.id !== workImageId));
    } else {
      toast.error(res.message);
    }
    setWorkImageId("");
    setShowDelete(false);
  };

  const handleApproveReject = async () => {
    const status = showApprove ? "2" : "3";
    const res = await approveRejectWorkImageById(status, workImageId);

    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== workImageId));
    } else {
      toast.error(res.message);
    }

    setWorkImageId("");
    setShowApprove(false);
    setShowReject(false);
  };

  useEffect(() => {
    if (userPermission) {
      const result = findMatchingPath(userPermission, pathname);
      setMatchingPathObject(result);
    }
  }, [userPermission, pathname, searchParams, navigate]);

  const checkPermission = matchingPathObject;

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("complaint_unique_id", {
        header: t("Complaint id"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("complaint_type_name", {
        header: t("Complaint Name"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("image_upload_by_name", {
        header: "Upload By",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.image_upload_by_image}
            name={info.row.original?.image_upload_by_name}
            login_id={user?.id}
            id={info.row.original?.image_upload_by}
            unique_id={info.row.original?.image_upload_by_employee_id}
            className={"d-align"}
          />
        ),
      }),
      columnHelper.accessor("status", {
        header: t("status"),
        cell: (info) => <StatusChip status={"Pending"} />,
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/WorkImages/view`, {
                    state: {
                      id: info.row.original.id,
                    },
                  }),
              },
              edit: {
                show: true,
                show: checkPermission?.update,
                action: () =>
                  navigate(`/WorkImages/create/${info.row.original.id}`),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setWorkImageId(info.row.original.id);
                  setShowDelete(true);
                },
              },
              approve: {
                show: true,
                action: () => {
                  setWorkImageId(info.row.original.id);
                  setShowApprove(true);
                },
              },
              reject: {
                show: true,
                action: () => {
                  setWorkImageId(info.row.original.id);
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

  useEffect(() => {
    fetchWorkImagesData();
  }, [search, pageNo, pageSize]);

  return (
    <>
      <Helmet>
        <title>Work Images · CMS Electricals</title>
      </Helmet>
      <CustomTable
        id={"request_work_images"}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        excelAction={false}
        pdfAction={false}
        align={"bottom"}
        apiForExcelPdf={getAllWorkImages}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{ show: false }}
          />
        )}
        tableTitleComponent={
          <div>
            <FileText /> <strong>Request - Work Images</strong>
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
    </>
  );
};

export default RequestWorkImages;
