import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { BsEyeFill } from "react-icons/bs";
import TooltipComponent from "../../../components/TooltipComponent";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllAppliedLeaves } from "../../../services/authapi";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import CustomTable from "../../../components/DataTable/CustomTable";
import { serialNumber } from "../../../utils/helper";

const ApprovedLeave = ({ search, handleEdit, refresh, checkPermission }) => {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [rows, setRows] = useState([]);

  const fetchData = async () => {
    const status = "approved";
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

  useEffect(() => {
    fetchData();
  }, [search, refresh, pageNo, pageSize]);

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
      // columnHelper.accessor("duration", {
      //   header: t("Duration"),
      //   cell: (info) =>
      //     `${info.row.original?.total_days}.00 Days ${info.row.original?.total_hours} Hours`,
      // }),
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
      columnHelper.accessor("status", {
        header: t("Status"),
        cell: (info) => (
          <div className="text-green">{info.row.original?.status}</div>
        ),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () => navigate(`/Leaves/view/${info.row.original.id}`),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, t, rows.length, pageNo, pageSize]
  );

  return (
    <Col md={12} data-aos={"fade-up"}>
      <CustomTable
        id={"approved_leave"}
        userPermission={checkPermission}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        hideFilters={false}
      />
    </Col>
  );
};

export default ApprovedLeave;
