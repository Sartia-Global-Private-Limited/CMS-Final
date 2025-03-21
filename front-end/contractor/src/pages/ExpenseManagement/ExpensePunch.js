import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { getPunchRequest } from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import CheckAndApprove from "./CheckAndApprove";
import { useDebounce } from "../../hooks/UseDebounce";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { UserDetail } from "../../components/ItemDetail";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { serialNumber } from "../../utils/helper";

const ExpensePunch = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const { t } = useTranslation();

  const fetchPunchRequestData = async () => {
    const res = await getPunchRequest(search, pageSize, pageNo);
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

  // set Delay time to get data on search
  const debounceValue = useDebounce(search, 500);

  useEffect(() => {
    fetchPunchRequestData();
  }, [debounceValue, pageNo, pageSize]);

  const handleClick = (e, tab) => {
    setActiveTab(tab);
    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
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
      columnHelper.accessor("employee_id", {
        header: "Employee ID",
      }),
      columnHelper.accessor("user_name", {
        header: "User name",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.user_image}
            name={info.row.original?.user_name}
            login_id={user?.id}
            id={info.row.original?.user_id}
            unique_id={info.row.original?.employee_id}
          />
        ),
      }),
      columnHelper.accessor("complaint_unique_id", {
        header: "complaint number",
      }),
      columnHelper.accessor("regional_office_name", {
        header: "regional office",
        cell: (info) => info.row.original.ro_detail?.regional_office_name,
      }),
      columnHelper.accessor("user_name", {
        header: "Sales Area Manager",
        cell: (info) => info.row.original.area_manager_detail?.user_name,
      }),
      columnHelper.accessor("outlet_name", {
        header: "outlet name",
        cell: (info) => info.row.original.outlet_detail?.outlet_name,
      }),
      columnHelper.accessor("punch_at", {
        header: "punch at",
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
                    `/expense-punch/create-expense-punch/${info.row.original.id}?type=view`,
                    {
                      state: {
                        Complain_id: info.row.original.complaint_id,
                        userId: info.row.original.user_id,
                      },
                    }
                  ),
              },

              approve: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/approve-expense-request/${info.row.original.id}`, {
                    state: {
                      Complain_id: info.row.original.complaint_id,
                      userId: info.row.original.user_id,
                    },
                  }),
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
      <Helmet>
        <title>Expense Punch · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Tabs
          onClick={(e, tab) => handleClick(e, tab)}
          activeTab={activeTab}
          ulClassName="border-primary p-2 border-bottom"
          activityClassName="bg-secondary"
        >
          <Tab className="pe-none fs-15 fw-bold" />
          <Tab className="ms-auto" title={t("Pending Request")}>
            {activeTab == "2" && (
              <>
                <CustomTable
                  id={"pending_request"}
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
                        to: `/expense-punch/create-expense-punch/new`,
                        title: "Create",
                      }}
                    />
                  )}
                  tableTitleComponent={
                    <div>
                      <UserPlus /> <strong>pending request</strong>
                    </div>
                  }
                />
              </>
            )}
          </Tab>
          <Tab title={t("Check and Approve")}>
            {activeTab == "3" && (
              <CheckAndApprove checkPermission={checkPermission} />
            )}
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default ExpensePunch;
