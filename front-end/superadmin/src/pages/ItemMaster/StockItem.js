import React, { useMemo } from "react";
import { useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Card, Col } from "react-bootstrap";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ItemDetail, UserDetail } from "../../components/ItemDetail";
import {
  AdminDeleteSurveyItemMaster,
  approveRejectFundtemById,
  getAdminAllSurveyItemMaster,
} from "../../services/authapi";
import StatusChip from "../../components/StatusChip";
import ApprovedStockItem from "./ApprovedStockItem";
import RejectedStockItem from "./RejectedStockItem";
import AllStockItem from "./AllStockItem";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { serialNumber } from "../../utils/helper";

const StockItem = () => {
  const [stockItemData, setStockItemData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [stockItemId, setStockItemId] = useState("");
  const [qty, setQty] = useState(0);

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
  const { userPermission } = useSelector(selectUser);

  const fetchAllSurveyData = async () => {
    const status = 0;
    const category = "stock";
    const res = await getAdminAllSurveyItemMaster({
      search,
      pageSize,
      pageNo,
      status,
      category,
    });
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
    const res = await AdminDeleteSurveyItemMaster(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleClick = (e, tab) => {
    localStorage.setItem("last_tab", tab);
    setActiveTab(tab);
  };

  useEffect(() => {
    fetchAllSurveyData();
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
      columnHelper.accessor("name", {
        header: t("Item"),
        cell: (info) => (
          <ItemDetail
            img={info.row.original?.image}
            name={info.row.original?.name}
            unique_id={info.row.original?.unique_id}
          />
        ),
      }),
      columnHelper.accessor("qty", {
        header: t("Qty"),
        cell: (info) => (info.row.original?.qty ? info.row.original?.qty : "-"),
      }),
      columnHelper.accessor("hsncode", {
        header: t("hsn code"),
        cell: (info) =>
          info.row.original?.hsncode ? info.row.original?.hsncode : "-",
      }),
      columnHelper.accessor("supplier_name", {
        header: t("supplier name"),
        cell: (info) => (
          <UserDetail
            img={info.row.original?.supplier_image}
            name={info.row.original?.supplier_name}
            id={info.row.original?.supplier_id}
            unique_id={info.row.original?.supplier_id}
          />
        ),
      }),
      columnHelper.accessor("sub_category", {
        header: t("sub category"),
        cell: (info) =>
          info.row.original?.sub_category
            ? info.row.original?.sub_category
            : "-",
      }),
      columnHelper.accessor("unit_name", {
        header: t("unit"),
        cell: (info) =>
          info.row.original?.unit_name ? info.row.original?.unit_name : "-",
      }),
      columnHelper.accessor("pending", {
        header: t("status"),
        cell: () => <StatusChip status="pending" />,
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: true,
                action: () =>
                  navigate(`/ItemMaster/view`, {
                    state: {
                      id: info.row.original?.id,
                    },
                  }),
              },
              edit: {
                show: true,
                action: () =>
                  navigate(
                    `/stock-request/create-stock-request/${info.row.original.fund_stock_id}?type=edit`
                  ),
              },
              // delete: {
              //   show: true,
              //   action: () => {
              //     setIdToDelete(info.row.original.id);
              //     setShowAlert(true);
              //   },
              // },
              approve: {
                show: true,
                action: () => {
                  setStockItemId(info.row.original.id);
                  setShowApprove(true);
                },
              },
              reject: {
                show: true,
                action: () => {
                  setStockItemId(info.row.original.id);
                  setShowReject(true);
                },
              },
            }}
          />
        ),
      }),
    ],
    [rows.length, pageNo, pageSize]
  );

  const handleApproveReject = async () => {
    const status = showApprove ? "1" : "2";
    const category = "stock";
    const res = await approveRejectFundtemById({
      id: stockItemId,
      status,
      category,
    });
    if (res.status) {
      toast.success(res.message);
      setStockItemData((prev) => prev.filter((itm) => itm.id !== stockItemId));
      setPageDetail({
        ...pageDetail,
        total: +pageDetail.total - 1,
        pageEndResult: pageDetail.pageEndResult - 1,
      });
    } else {
      toast.error(res.message);
    }
    setStockItemId("");
    setShowApprove(false);
    setShowReject(false);
  };

  return (
    <>
      <Helmet>
        <title>Fund Item · CMS Electricals</title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <Tabs
            onClick={(e, tab) => handleClick(e, tab)}
            activeTab={activeTab}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab
              className="pe-none fs-15 fw-bold"
              title={t("Stock Item Request")}
            />

            <Tab className="ms-auto" title={t("Pending Request")}>
              {activeTab == "2" && (
                <CustomTable
                  id={"fund_item"}
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
                      userPermission={userPermission}
                      setSearchText={setSearch}
                      permissions={true}
                    />
                  )}
                />
              )}

              <ConfirmAlert
                size={"sm"}
                deleteFunction={handleApproveReject}
                hide={setShowApprove}
                show={showApprove}
                title={"Confirm Approve"}
                description={"Are you sure you want to approve this!!"}
              />

              <ConfirmAlert
                size={"sm"}
                deleteFunction={handleApproveReject}
                hide={setShowReject}
                show={showReject}
                title={"Confirm reject"}
                description={"Are you sure you want to reject this!!"}
              />

              <ConfirmAlert
                size={"sm"}
                deleteFunction={handleDelete}
                hide={setShowAlert}
                show={showAlert}
                title={"Confirm Delete"}
                description={"Are you sure you want to delete this!!"}
              />
            </Tab>

            <Tab title={t("Approved")}>
              {activeTab == "3" && <ApprovedStockItem />}
            </Tab>

            <Tab title={t("Rejected")}>
              {activeTab == "4" && <RejectedStockItem />}
            </Tab>

            <Tab title={t("Stock Item")}>
              {activeTab == "5" && <AllStockItem />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default StockItem;
