import React, { useEffect, useMemo, useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import {
  UpdateResignationsRequest,
  getAllResignationsApprovedRequest,
  getAllResignationsRejectedRequest,
  getAllResignationsPendingRequest,
  getAllGeneratedFNF,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { getDateValue, serialNumber } from "../../../utils/helper";
import { UserDetail } from "../../../components/ItemDetail";
import { BsFileEarmarkPdf } from "react-icons/bs";
import ConfirmAlert from "../../../components/ConfirmAlert";
import StatusChip from "../../../components/StatusChip";

const EmployeeResignation = ({ checkPermission }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const { user } = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const [typeData, setTypeData] = useState("Requests");

  const columnHelper = createColumnHelper();

  const fetchData = async () => {
    let res;
    switch (typeData) {
      case "Requests":
        res = await getAllResignationsPendingRequest({
          search,
          pageSize,
          pageNo,
        });
        break;
      case "Approved":
        res = await getAllResignationsApprovedRequest({
          search,
          pageSize,
          pageNo,
        });
        break;
      case "Rejected":
        res = await getAllResignationsRejectedRequest({
          search,
          pageSize,
          pageNo,
        });
        break;
      case "Statement":
        res = await getAllGeneratedFNF({
          search,
          pageSize,
          pageNo,
        });
        break;
      default:
        res = await getAllResignationsPendingRequest({
          search,
          pageSize,
          pageNo,
        });
        break;
    }

    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total || 0);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  // Handle Approve/Reject Actions
  const handleAction = async () => {
    const res = await UpdateResignationsRequest(edit?.id, edit?.status);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((item) => item.id !== edit?.id));
    } else {
      toast.error(res.message);
    }
    setShowAlert(false);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) =>
          serialNumber(pageNo, pageSize)[info.row.index] || info.row.index + 1,
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
      columnHelper.accessor("resignation_date", {
        header: t("Resignation Date"),
        cell: (info) => getDateValue(info.getValue()),
      }),
      columnHelper.accessor("last_working_day", {
        header: t("Last Day of Work"),
        cell: (info) => getDateValue(info.getValue()),
      }),
      columnHelper.accessor("status", {
        header: t("status"),
        cell: (info) => (
          <StatusChip
            status={
              typeData == "Requests"
                ? "Pending"
                : typeData == "Fnf Statement"
                ? "Completed"
                : typeData
            }
          />
        ),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => {
          return (
            <ActionButtons
              actions={{
                view: {
                  show: checkPermission?.view,
                  action: () =>
                    navigate(
                      `/EmployeeResignation/view/${info.row.original.id}`
                    ),
                },
                edit: {
                  show:
                    typeData !== "Requests" ? checkPermission?.update : false,
                  tooltipTitle: "FNF Statement",
                  disabled: false,
                  action: () =>
                    navigate(
                      `/EmployeeResignation/create/${info.row.original.id}`
                    ),
                  icon: BsFileEarmarkPdf,
                  align: "top",
                  className: "social-btn success-combo",
                },
                approve: {
                  show:
                    typeData == "Requests" ? checkPermission?.update : false,
                  action: () => {
                    setEdit({ id: info.row.original.id, status: 1 });
                    setShowAlert(true);
                  },
                },
                reject: {
                  show:
                    typeData == "Requests" ? checkPermission?.update : false,
                  action: () => {
                    setEdit({ id: info.row.original.id, status: 2 });
                    setShowAlert(true);
                  },
                },
              }}
            />
          );
        },
      }),
    ],
    [checkPermission, t, rows.length, typeData, pageNo, pageSize]
  );

  const tabs = [
    { title: t("Requests"), status: "pending" },
    { title: t("Approved"), status: "approved" },
    { title: t("Rejected"), status: "rejected" },
    { title: t("Fnf Statement"), status: "fnf_statement" },
  ];

  const handleClick = async (e) => {
    setTypeData(e.target.textContent);
  };

  useEffect(() => {
    fetchData();
  }, [search, pageNo, pageSize, typeData]);

  return (
    <>
      <Helmet>
        <title>{t("Employee Resignation")}</title>
      </Helmet>
      <Col md={12}>
        <Tabs
          activeTab={1}
          ulClassName="border-primary py-2 border-bottom"
          activityClassName="bg-secondary"
          onClick={(e) => {
            handleClick(e);
            if (searchParams.has("pageNo")) {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete("pageNo");
              navigate(`?${newParams.toString()}`, { replace: true });
            }
          }}
        >
          {tabs?.map((tab, index) => (
            <Tab
              key={index}
              title={tab.title}
              className={index == 0 && "ms-auto"}
            >
              <CustomTable
                id={`employee_resign_${tab.status}`}
                userPermission={checkPermission}
                maxHeight={"40vh"}
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
                      show: tab.status === "pending",
                      noDrop: true,
                      to: `/EmployeeResignation/create/new`,
                      title: t("Create"),
                    }}
                  />
                )}
                tableTitleComponent={<strong>{tab.title}</strong>}
              />
            </Tab>
          ))}
        </Tabs>
      </Col>

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleAction}
        hide={setShowAlert}
        show={showAlert}
        title={`Confirm ${edit?.status == 1 ? "Approve" : "Reject"}`}
        description={`Are you sure you want to ${
          edit?.status == 1 ? "approve" : "reject"
        } this!!`}
      />
    </>
  );
};

export default EmployeeResignation;
