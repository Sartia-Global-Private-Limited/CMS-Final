import React, { useEffect, useMemo, useState } from "react";
import { Badge, Col } from "react-bootstrap";
import { getAllPendingTransferStockRequest } from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import AllTransferStock from "./AllTransferStock";
import AllStock from "./AllStock";
import RescheduledStockTransfer from "./RescheduledStockTransfer";
import { useTranslation } from "react-i18next";
import { UserDetail } from "../../components/ItemDetail";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { ArrowLeftRight, UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import { formatNumberToINR, serialNumber } from "../../utils/helper";

const StockTransfer = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();
  const { user } = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const { t } = useTranslation();
  const fetchPendingStockTransferData = async () => {
    const res = await getAllPendingTransferStockRequest({
      search,
      pageSize,
      pageNo,
    });
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

  // const results = !searchTerm
  //   ? pendingStockTransfer
  //   : pendingStockTransfer.filter(
  //       (itm) =>
  //         itm?.request_by
  //           ?.toLowerCase()
  //           .includes(searchTerm.toLocaleLowerCase()) ||
  //         itm?.request_by_employee_id
  //           ?.toLowerCase()
  //           .includes(searchTerm.toLocaleLowerCase())
  //     );

  useEffect(() => {
    fetchPendingStockTransferData();
  }, [search, pageNo, pageSize]);

  // const handlePageSizeChange = (selectedOption) => {
  //   setPageSize(selectedOption.value);
  // };

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
      columnHelper.accessor("unique_id", {
        header: "Unique ID",
      }),
      columnHelper.accessor("request_for", {
        header: "Request For",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.request_for_image}
            name={info.row.original?.request_for}
            login_id={user?.id}
            id={info.row.original?.request_for_id}
            unique_id={info.row.original?.request_for_employee_id}
          />
        ),
      }),
      columnHelper.accessor("request_date", {
        header: "request date",
      }),
      columnHelper.accessor("total_request_qty", {
        header: "request qty",
        cell: (info) => (
          <div
            className={`fw-bolder text-${
              info.row.original.total_request_qty > 0 ? "green" : "danger"
            }`}
          >
            {info.row.original.total_request_qty > 0
              ? info.row.original.total_request_qty
              : "0"}
          </div>
        ),
      }),
      columnHelper.accessor("total_requested_amount", {
        header: "Total Requested Amount",
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("supplier_name", {
        header: "supplier name",
      }),
      columnHelper.accessor("total_request_items", {
        header: "Total items",
        cell: (info) => (
          <div>
            <Badge bg="orange" className="fw-normal" style={{ fontSize: 11 }}>
              {info.row.original.total_request_items} old
            </Badge>
            &ensp;
            <Badge
              bg="secondary"
              className="fw-normal"
              style={{ fontSize: 11, marginTop: "5px" }}
            >
              {info.row.original.total_new_request_items} new
            </Badge>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <div
            className={`text-${
              info.row.original?.status === "1" ? "danger" : "green"
            }`}
          >
            {info.row.original?.status === "1" ? "Pending" : "Partial"}
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
                  navigate(
                    `/stock-transfer/create-stock-transfer/${info.row.original.id}?type=view`
                  ),
              },
              reject: {
                show: checkPermission?.update,
                disabled: !info.row.original?.active ? true : false,
                icon: ArrowLeftRight,
                tooltipTitle: "Transfer",
                align: "left",
                action: () =>
                  navigate(
                    `/stock-transfer/create-stock-transfer/${info.row.original.id}?type=transfer`
                  ),
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
        <title>Fund Transfer · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Tabs
          onClick={(e, tab) => handleClick(e, tab)}
          activeTab={activeTab}
          ulClassName="border-primary p-2 border-bottom"
          activityClassName="bg-secondary"
        >
          <Tab className="pe-none fs-15 fw-bold" />
          <Tab className="ms-auto" title={t("Pending Transfer")}>
            {activeTab == "2" && (
              <>
                <CustomTable
                  id={"stock_transfer"}
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
                        show: false,
                      }}
                    />
                  )}
                  tableTitleComponent={
                    <div>
                      <UserPlus /> <strong>stock transfer</strong>
                    </div>
                  }
                />
              </>
            )}
          </Tab>
          <Tab title={t("Rescheduled Stock")}>
            {activeTab == "3" && (
              <RescheduledStockTransfer checkPermission={checkPermission} />
            )}
          </Tab>
          <Tab title={t("Transfered Stock")}>
            {activeTab == "4" && (
              <AllTransferStock checkPermission={checkPermission} />
            )}
          </Tab>
          <Tab title={t("All")} className="me-1">
            {activeTab == "5" && <AllStock checkPermission={checkPermission} />}
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default StockTransfer;
