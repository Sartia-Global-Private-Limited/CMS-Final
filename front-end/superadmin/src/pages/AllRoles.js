import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { getAdminAllRoles, getAdminDeleteRoles } from "../services/authapi";
import { toast } from "react-toastify";
import ConfirmAlert from "../components/ConfirmAlert";
import moment from "moment";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../components/DataTable/ActionButtons";
import TableHeader from "../components/DataTable/TableHeader";
import CustomTable from "../components/DataTable/CustomTable";
import { findMatchingPath, serialNumber } from "../utils/helper";

const AllRoles = ({}) => {
  const navigate = useNavigate();
  let { pathname } = useLocation();
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);
  const [matchingPathObject, setMatchingPathObject] = useState(null);

  const fetchRolesData = async () => {
    const res = await getAdminAllRoles(search, pageSize, pageNo);
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
    const res = await getAdminDeleteRoles(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
      fetchRolesData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
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
      columnHelper.accessor("name", {
        header: t("Roles"),
      }),
      columnHelper.accessor("created_at", {
        header: t("Date"),
        cell: (info) =>
          moment(info.row.original?.created_at).format("DD-MM-YYYY"),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => {
          const isDisabled = [1, 2, 3, 4].includes(info.row.original?.id);
          return (
            <ActionButtons
              actions={{
                view: {
                  show: checkPermission?.view,
                  tooltipTitle: "View & Edit Permissions",
                  action: () =>
                    navigate(
                      `/AllRoles/ViewRolesPermissions/${info.row.original?.id}`
                    ),
                },
                edit: {
                  disabled: isDisabled,
                  show: checkPermission?.update,
                  tooltipTitle: "Edit Role",
                  action: () =>
                    navigate(`/AllRoles/create/${info.row.original.id}`),
                },
                delete: {
                  disabled: isDisabled,
                  show: checkPermission?.delete,
                  action: () => {
                    setIdToDelete(`${info.row.original?.id}`);
                    setShowAlert(true);
                  },
                },
              }}
            />
          );
        },
      }),
    ],
    [checkPermission, t, rows.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchRolesData();
  }, [search, pageNo, pageSize]);

  return (
    <>
      <Helmet>
        <title>All Roles · CMS Electricals</title>
      </Helmet>

      <CustomTable
        id={"all_roles"}
        userPermission={checkPermission}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        align={"bottom"}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              noDrop: true,
              title: "Create",
              to: `/AllRoles/create/new`,
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <strong>All Roles</strong>
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
    </>
  );
};

export default AllRoles;
