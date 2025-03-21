import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import {
  getAdminAllTasklist,
  getAdminDeleteTask,
} from "../../services/authapi";
import ConfirmAlert from "../../components/ConfirmAlert";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import {
  findMatchingPath,
  getDateValue,
  serialNumber,
} from "../../utils/helper";
import { UserDetail, UserDetails } from "../../components/ItemDetail";

const RequestedTask = () => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const { pathname } = useLocation();
  const [matchingPathObject, setMatchingPathObject] = useState(null);

  const fetchTaskListData = async () => {
    const status = 1;
    const res = await getAdminAllTasklist(search, pageSize, pageNo, status);
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
    const res = await getAdminDeleteTask(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
      fetchTaskListData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchTaskListData();
  }, [search, pageNo, pageSize]);

  // for role and permissions
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
      columnHelper.accessor("category_name", {
        header: "task category",
        cell: (info) => (
          <div
            className={
              info.row.original.start_date > info.row.original.end_date &&
              "text-danger"
            }
          >
            {info.row.original.category_name}
          </div>
        ),
      }),
      columnHelper.accessor("title", {
        header: "task name",
      }),
      columnHelper.accessor("project_name", {
        header: "project name",
      }),
      columnHelper.accessor("assign_user_name", {
        header: "task assign",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.assign_to_image}
            name={info.row.original?.assign_user_name}
            id={info.row.original?.assign_to}
            unique_id={info.row.original?.assign_to_employee_id}
            className={"justify-content-center"}
          />
        ),
      }),
      columnHelper.accessor("collaborators_list", {
        header: "Collaborators",
        cell: (info) => (
          <div className="d-align">
            {info.row.original?.collaborators_list
              .slice(0, 5)
              .map((user, index) => (
                <Fragment key={index}>
                  <UserDetails
                    img={user?.image}
                    name={user?.name}
                    id={user?.id}
                    unique_id={user?.employee_id}
                  />
                </Fragment>
              ))}
          </div>
        ),
      }),
      columnHelper.accessor("start_date", {
        header: "start date",
        cell: (info) => getDateValue(info.getValue()),
      }),
      columnHelper.accessor("end_date", {
        header: "end date",
        cell: (info) => getDateValue(info.getValue()),
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => (
          <div
            className={
              info.row.original.start_date > info.row.original.end_date &&
              "text-danger"
            }
          >
            {info.row.original.status}
          </div>
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
                  navigate(`/AllTask/TaskView/${info.row.original.id}`),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/task/create/${info.row.original.id}`, {
                    state: {
                      list: info.row.original,
                    },
                  }),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(info.row.original.id);
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

  return (
    <>
      <Helmet>
        <title>Task Manager · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CustomTable
          id={"requested_task"}
          userPermission={checkPermission}
          isLoading={isLoading}
          rows={rows || []}
          columns={columns}
          align={"bottom"}
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
                to: `/task/create/new`,
                title: "Create",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>requested task</strong>
            </div>
          }
        />

        <ConfirmAlert
          size={"sm"}
          deleteFunction={handleDelete}
          hide={setShowAlert}
          show={showAlert}
          title={"Confirm Delete"}
          description={"Are you sure you want to delete this!!"}
        />
      </Col>
    </>
  );
};

export default RequestedTask;
