import React, { useEffect, useMemo, useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import {
  getAllPendingLoans,
  getAllActiveLoans,
  getAllRejectedLoans,
  getAllClosedLoans,
  ChangedLoanStatus,
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
import {
  formatNumberToINR,
  getDateValue,
  serialNumber,
} from "../../../utils/helper";
import { UserDetail } from "../../../components/ItemDetail";
import ConfirmAlert from "../../../components/ConfirmAlert";
import StatusChip from "../../../components/StatusChip";
import { FaBan } from "react-icons/fa";

const Loan = ({ checkPermission }) => {
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
        res = await getAllPendingLoans({
          search,
          pageSize,
          pageNo,
        });
        break;
      case "Active":
        res = await getAllActiveLoans({
          search,
          pageSize,
          pageNo,
        });
        break;
      case "Rejected":
        res = await getAllRejectedLoans({
          search,
          pageSize,
          pageNo,
        });
        break;
      case "Closed Loans":
        res = await getAllClosedLoans({
          search,
          pageSize,
          pageNo,
        });
        break;
      default:
        res = await getAllPendingLoans({
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

  // Handle Approve/Reject and Closed Actions
  const handleAction = async () => {
    const res = await ChangedLoanStatus({
      id: edit?.id,
      user_id: edit?.user_id,
      status: edit?.status,
    });
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
      columnHelper.accessor("name", {
        header: t("Employee Name"),
        cell: (info) => (
          <UserDetail
            img={info.row.original?.image}
            name={info.row.original?.name}
            id={info.row.original?.user_id}
            unique_id={info.row.original?.employee_id}
            login_id={user.id}
          />
        ),
      }),
      columnHelper.accessor("loan_date", {
        header: t("Loan Date"),
        cell: (info) => getDateValue(info.getValue()),
      }),
      columnHelper.accessor("loan_type", {
        header: t("Loan Type"),
      }),
      columnHelper.accessor("loan_amount", {
        header: t("Loan Amount"),
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("loan_term", {
        header: t("Loan Term"),
      }),
      columnHelper.accessor("status", {
        header: t("status"),
        cell: (info) => (
          <StatusChip
            status={
              typeData == "Requests"
                ? "pending"
                : typeData == "Closed Loans"
                ? "closed"
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
                  action: () => navigate(`/Loan/view/${info.row.original.id}`),
                },
                edit: {
                  show:
                    typeData == "Requests" ? checkPermission?.update : false,
                  action: () =>
                    navigate(`/Loan/create/${info.row.original.id}`),
                },
                approve: {
                  show:
                    typeData == "Requests" ? checkPermission?.update : false,
                  action: () => {
                    setEdit({
                      id: info.row.original.id,
                      user_id: info.row.original.user_id,
                      status: "active",
                    });
                    setShowAlert(true);
                  },
                },
                reject: {
                  show:
                    typeData == "Requests" ? checkPermission?.update : false,
                  action: () => {
                    setEdit({
                      id: info.row.original.id,
                      user_id: info.row.original.user_id,
                      status: "reject",
                    });
                    setShowAlert(true);
                  },
                },
                delete: {
                  show: typeData == "Active" ? checkPermission?.update : false,
                  tooltipTitle: "Close",
                  icon: FaBan,
                  action: () => {
                    setEdit({
                      id: info.row.original.id,
                      user_id: info.row.original.user_id,
                      status: "closed",
                    });
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
    { title: t("Active"), status: "Active" },
    { title: t("Rejected"), status: "rejected" },
    { title: t("Closed Loans"), status: "closed_loans" },
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
        <title>{t("Loan")}</title>
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
                id={`loan_${tab.status}`}
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
                      to: `/Loan/create/new`,
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
        title={`Confirm ${
          edit?.status == "active"
            ? "Approve"
            : edit?.status == "closed"
            ? "Closed"
            : "Reject"
        }`}
        description={`Are you sure you want to ${
          edit?.status == "active"
            ? "approve"
            : edit?.status == "closed"
            ? "Closed"
            : "reject"
        } this!!`}
      />
    </>
  );
};

export default Loan;
