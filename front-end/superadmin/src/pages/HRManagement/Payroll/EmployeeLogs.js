import React, { useEffect, useMemo } from "react";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { getAllEmployeeLogs } from "../../../services/authapi";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { UserDetail } from "../../../components/ItemDetail";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { serialNumber } from "../../../utils/helper";

const EmployeeLogs = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission, user } = useSelector(selectUser);

  const fetchEmployeeLogsData = async () => {
    const res = await getAllEmployeeLogs(search, pageSize, pageNo);
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
    fetchEmployeeLogsData();
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
      columnHelper.accessor("user_name", {
        header: t("Employee Name"),
        cell: (info) => (
          <UserDetail
            img={info.row.original?.image}
            name={info.row.original?.user_name}
            id={info.row.original?.user_id}
            unique_id={info.row.original?.employee_id}
            login_id={user.id}
          />
        ),
      }),
      columnHelper.accessor("timestamp", {
        header: t("Activity Time"),
        cell: (info) =>
          moment(info.row?.original?.timestamp).format("DD-MM-YYYY"),
      }),
      columnHelper.accessor("action", {
        header: t("Activity Description"),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(
                    `/EmployeeLogs/EmployeeActivity/${info.row.original?.id}`
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
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Employee Logs · CMS Electricals</title>
      </Helmet>

      <CustomTable
        id={"employee_Logs"}
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
            permissions={true}
          />
        )}
        tableTitleComponent={
          <div>
            <strong>Employee Logs</strong>
          </div>
        }
      />
    </Col>
  );
};

export default EmployeeLogs;
