import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { getOfficeExpenseRequest } from "../../../services/contractorApi";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import PartialExpense from "./PartialExpense";
import ApprovedExpense from "./ApprovedExpense";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StatusChip from "../../../components/StatusChip";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { UserDetail } from "../../../components/ItemDetail";
import { getDateValue, serialNumber } from "../../../utils/helper";
import LevelWiseSelect from "../../../components/LevelWiseSelect";

const PendingExpense = ({ checkPermission }) => {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [selectedData, setSelectedData] = useState({ id: "", type: "" });

  const fetchExpenseRequestData = async () => {
    const res = await getOfficeExpenseRequest({
      pageSize,
      pageNo,
      search,
      user_id: selectedData?.id,
    });
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

  useEffect(() => {
    fetchExpenseRequestData();
  }, [pageNo, search, pageSize, selectedData?.id]);

  const handleClick = (e, tab) => {
    setActiveTab(tab);
    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  const handleLevelChange = ({ id, type }) => {
    setSelectedData({ id, type });
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
        header: "employee id",
        cell: (info) => info.row.original.employee?.employee_id,
      }),
      columnHelper.accessor("username", {
        header: "employee name",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.employee?.image}
            name={info.row.original?.employee?.username}
            id={info.row.original?.employee?.id}
            unique_id={info.row.original?.employee?.employee_id}
            login_id={user.id}
          />
        ),
      }),
      columnHelper.accessor("regional_office_name", {
        header: "regional office",
        cell: (info) =>
          info.row.original.regionalOffice?.[0]?.regional_office_name,
      }),
      columnHelper.accessor("sales_area_name", {
        header: "sales area",
        cell: (info) => info.row.original.saleAreaDetails?.[0]?.sales_area_name,
      }),
      columnHelper.accessor("outlet_name", {
        header: "outlet name",
        cell: (info) => info.row.original.outlet?.[0]?.outlet_name,
      }),
      columnHelper.accessor("outlet_ccnohsd", {
        header: "outlet ccnohsd",
        cell: (info) => info.row.original.outlet?.[0]?.outlet_ccnohsd,
      }),
      columnHelper.accessor("outlet_ccnoms", {
        header: "outlet ccnoms",
        cell: (info) => info.row.original.outlet?.[0]?.outlet_ccnoms,
      }),
      columnHelper.accessor("total_amount", {
        header: "total amount",
        cell: (info) => (
          <div className="fw-bolder text-green">
            {info.row.original?.total_amount}
          </div>
        ),
      }),
      columnHelper.accessor("total_complaints", {
        header: "total complaints",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => (
          <StatusChip status={info.row.original.status == "0" && "pending"} />
        ),
      }),
      columnHelper.accessor("month", {
        header: "date",
        cell: (info) => getDateValue(info.getValue(), "MMMM YYYY"),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/view-office-expense`, {
                    state: {
                      outletId: info.row.original?.outlet?.[0]?.id,
                      month: info.row.original?.month,
                      allData: info.row.original,
                      allData: info.row.original,
                      type: "pending",
                    },
                  }),
              },
              approve: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/approve-office-expense`, {
                    state: {
                      outletId: info.row.original?.outlet?.[0]?.id,
                      month: info.row.original?.month,
                      allData: info.row.original,
                      allData: info.row.original,
                      type: "pending",
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
        <title>Office Inspection· CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Tabs
          onClick={(e, tab) => handleClick(e, tab)}
          activeTab={activeTab}
          ulClassName="border-primary p-2 border-bottom"
          activityClassName="bg-secondary"
        >
          <Tab className="ms-auto" title={t("Pending Stock")}>
            {activeTab == "1" && (
              <>
                <LevelWiseSelect onChange={handleLevelChange} />
                <CustomTable
                  id={"pending_expense"}
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
                      button={{ show: false }}
                    />
                  )}
                  tableTitleComponent={
                    <div>
                      <UserPlus /> <strong>Pending Stock</strong>
                    </div>
                  }
                />
              </>
            )}
          </Tab>
          <Tab title={t("Partial")}>
            {activeTab == "2" && (
              <PartialExpense checkPermission={checkPermission} />
            )}
          </Tab>
          <Tab title={t("Approved")}>
            {activeTab == "3" && (
              <ApprovedExpense checkPermission={checkPermission} />
            )}
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default PendingExpense;
