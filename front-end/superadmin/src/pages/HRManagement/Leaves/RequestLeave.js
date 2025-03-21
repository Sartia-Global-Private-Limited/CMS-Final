import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { BsCheckLg } from "react-icons/bs";
import {
  approvedLeaveRequest,
  getAllAppliedLeaves,
} from "../../../services/authapi";
import moment from "moment/moment";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import CustomTable from "../../../components/DataTable/CustomTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import TableHeader from "../../../components/DataTable/TableHeader";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { serialNumber } from "../../../utils/helper";

const RequestLeave = ({
  search,
  handleEdit,
  setRefresh,
  refresh,
  checkPermission,
}) => {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertOne, setShowAlertOne] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [rows, setRows] = useState([]);
  const { userPermission } = useSelector(selectUser);

  const [idToApprove, setIdToApprove] = useState({
    id: "",
    status: "",
  });

  const [idToReject, setIdToReject] = useState({
    id: "",
    status: "",
  });

  const fetchData = async () => {
    const status = "pending";
    const res = await getAllAppliedLeaves(search, pageSize, pageNo, status);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleApproveRequest = async () => {
    const rData = {
      id: idToApprove.id,
      status: idToApprove.status === "pending" ? "approved" : "pending",
    };
    const res = await approvedLeaveRequest(rData);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIdToApprove("");
    setShowAlert(false);
    setRefresh(!refresh);
  };

  const handleRejectRequest = async () => {
    const rData = {
      id: idToReject.id,
      status: idToReject.status === "pending" ? "rejected" : "pending",
    };
    const res = await approvedLeaveRequest(rData);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIdToReject("");
    setShowAlertOne(false);
    setRefresh(!refresh);
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
      columnHelper.accessor("id", {
        header: t("Id"),
      }),
      columnHelper.accessor("name", {
        header: t("Employee Name"),
        cell: (info) => (
          <div className="text-truncate text-start">
            <img
              className="avatar me-2"
              src={
                info.row.original.image
                  ? `${process.env.REACT_APP_API_URL}/${info.row.original.image}`
                  : "./assets/images/default-image.png"
              }
              alt="user-img"
            />
            {info.row.original?.applicant_name}
          </div>
        ),
      }),
      columnHelper.accessor("duration", {
        header: t("Duration"),
        cell: (info) =>
          `${info.row.original?.total_days}.00 Days ${info.row.original?.total_hours} Hours`,
      }),
      columnHelper.accessor("start_date", {
        header: t("Start Date"),
        cell: (info) =>
          moment(info.row.original?.start_date).format("DD/MM/YYYY"),
      }),
      columnHelper.accessor("end_date", {
        header: t("End Date"),
        cell: (info) =>
          moment(info.row.original?.end_date).format("DD/MM/YYYY"),
      }),
      columnHelper.accessor("leave_type", {
        header: t("Leave Type"),
        cell: (info) =>
          info.row.original?.leave_type ? info.row.original?.leave_type : "-",
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              // view: {
              //   show: checkPermission?.view,
              //   action: () => handleEdit(info.row.original),
              // },
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/Leaves/view/${info.row.original.id}`, {
                    state: { status: "pending" },
                  }),
              },
              reject: {
                show: checkPermission?.update,
                action: () => {
                  setIdToReject({
                    id: info.row.original?.id,
                    status: info.row.original?.status,
                  });
                  setShowAlertOne(true);
                },
              },
              approve: {
                show: checkPermission?.update,
                action: () => {
                  setIdToApprove({
                    id: info.row.original?.id,
                    status: info.row.original?.status,
                  });
                  setShowAlert(true);
                },
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, t, rows.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchData();
  }, [search, refresh, pageNo, pageSize]);

  return (
    <>
      <Col md={12} data-aos={"fade-up"}>
        <CustomTable
          id={"requested_leave"}
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
              button={{
                noDrop: true,
                to: `/Leaves/create/new`,
                title: "Create",
              }}
            />
          )}
        />
      </Col>

      <ConfirmAlert
        size={"sm"}
        icon={<BsCheckLg />}
        deleteFunction={handleApproveRequest}
        hide={setShowAlert}
        show={showAlert}
        title={"Approved?"}
        description={"Are you sure you want to Approve Leave Request!!"}
      />

      <ConfirmAlert
        size={"sm"}
        icon={<BsCheckLg />}
        deleteFunction={handleRejectRequest}
        hide={setShowAlertOne}
        show={showAlertOne}
        title={"Rejected?"}
        description={"Are you sure you want to Reject Leave Request!!"}
      />
    </>
  );
};

export default RequestLeave;
