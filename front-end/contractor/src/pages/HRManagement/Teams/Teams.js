import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { deleteTeam, getAdminAllHRTeams } from "../../../services/authapi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserDetail, UserDetails } from "../../../components/ItemDetail";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { findMatchingPath, serialNumber } from "../../../utils/helper";

const Teams = () => {
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
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { pathname } = useLocation();
  const [matchingPathObject, setMatchingPathObject] = useState(null);

  //All teams
  const fetchAllHrTeamsData = async () => {
    const res = await getAdminAllHRTeams({ search, pageSize, pageNo });
    if (res.status) {
      setRows(res?.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  // Delete Team
  const handleDelete = async () => {
    const res = await deleteTeam(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.team_id !== +idToDelete));
      fetchAllHrTeamsData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchAllHrTeamsData();
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
      columnHelper.accessor("team_name", {
        header: "team name",
      }),
      columnHelper.accessor("manager_name", {
        header: "manager",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.manager_image}
            name={info.row.original?.manager_name}
            id={info.row.original?.manager_id}
            unique_id={info.row.original?.manager_employee_id}
          />
        ),
      }),
      columnHelper.accessor("supervisor_name", {
        header: "supervisor",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.supervisor_image}
            name={info.row.original?.supervisor_name}
            id={info.row.original?.supervisor_id}
            unique_id={info.row.original?.supervisor_employee_id}
          />
        ),
      }),
      columnHelper.accessor("name", {
        header: "members",
        cell: (info) => (
          <div className="d-flex align-items-center">
            {info.row.original?.members.slice(0, 5).map((user, index) => (
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
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/Teams/HrTeamMembers/${info.row.original.team_id}`),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/Teams/create-teams/${info.row.original.team_id}`),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(info.row.original.team_id);
                  setShowAlert(true);
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
        <CustomTable
          id={"all_teams"}
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
              setSearchText={setSearch}
              button={{
                noDrop: true,
                to: `/Teams/create-teams/new`,
                title: "Create",
              }}
              userPermission={checkPermission}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>all teams</strong>
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

export default Teams;
