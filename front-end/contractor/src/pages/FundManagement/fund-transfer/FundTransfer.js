import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getAllPendingTransferFundRequest,
  postRejectFundRequest,
} from "../../../services/contractorApi";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import AllTransferedFund from "./AllTransferedFund";
import AllFund from "./AllFund";
import RescheduledTransfer from "./RescheduledTransfer";
import { useTranslation } from "react-i18next";
import { UserDetail } from "../../../components/ItemDetail";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { ArrowLeftRight, UserPlus } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import StatusChip from "../../../components/StatusChip";
import { formatNumberToINR, serialNumber } from "../../../utils/helper";

const FundTransfer = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const { user } = useSelector(selectUser);
  const [storeId, setStoreId] = useState({});
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [showAlert, setShowAlert] = useState(false);

  const fetchPendingFundTransferData = async () => {
    const res = await getAllPendingTransferFundRequest(
      search,
      pageSize,
      pageNo
    );
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

  const handleRejected = async () => {
    const module = "fund-transfer";
    const res = await postRejectFundRequest(storeId.id, module);
    if (res.status) {
      toast.success(res.message);
      fetchPendingFundTransferData();
    } else {
      toast.error(res.message);
    }
    setShowAlert(false);
  };

  useEffect(() => {
    fetchPendingFundTransferData();
  }, [search, pageNo, pageSize]);

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
      columnHelper.accessor("total_request_amount", {
        header: "request amount",
        cell: (info) => (
          <div
            className={`fw-bolder text-${
              info.row.original.total_request_amount > 0 ? "green" : "danger"
            }`}
          >
            {formatNumberToINR(info.row.original.total_request_amount)}
          </div>
        ),
      }),
      columnHelper.accessor("total_approved_amount", {
        header: "total approved amount",
        cell: (info) => (
          <div
            className={`fw-bolder text-${
              info.row.original.total_approved_amount > 0 ? "green" : "danger"
            }`}
          >
            {formatNumberToINR(info.row.original.total_approved_amount)}
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={info.row.original.status} />,
      }),
      columnHelper.accessor("action", {
        header: "action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(
                    `/fund-transfer/create-fund-transfer/${info.row.original.id}?type=view`
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
                    `/fund-transfer/create-fund-transfer/${info.row.original.id}?type=transfer`
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
          <Tab className="ms-auto" title={[t("Pending Transfer")]}>
            {activeTab == "2" && (
              <>
                <CustomTable
                  id={"fund_transfer"}
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
                      button={{ show: false }}
                    />
                  )}
                  tableTitleComponent={
                    <div>
                      <UserPlus /> <strong>Fund Transfer</strong>
                    </div>
                  }
                />
              </>
            )}
          </Tab>
          <Tab title={t("Rescheduled Fund")}>
            {activeTab == "3" && (
              <RescheduledTransfer checkPermission={checkPermission} />
            )}
          </Tab>
          <Tab title={[t("Transfered Fund")]}>
            {activeTab == "4" && (
              <AllTransferedFund checkPermission={checkPermission} />
            )}
          </Tab>

          <Tab title={[t("All")]} className="me-1">
            {activeTab == "5" && <AllFund checkPermission={checkPermission} />}
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default FundTransfer;
