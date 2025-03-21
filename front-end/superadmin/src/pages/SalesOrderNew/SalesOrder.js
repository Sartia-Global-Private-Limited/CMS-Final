import React, { useMemo } from "react";
import { useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Col } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import SecurityDeposit from "./SecurityDeposit";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  deleteSalesOrderById,
  getAllSalesOrder,
  postChangeSoStatus,
} from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Switch from "../../components/Switch";
import { useTranslation } from "react-i18next";
import SecurityPaid from "./SecurityPaid";
import SecurityEligible from "./SecurityEligible";
import SecurityProcess from "./SecurityProcess";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { BadgeIndianRupee } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import { formatNumberToINR, serialNumber } from "../../utils/helper";

const SalesOrder = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [activeTab, setActiveTab] = useState(1);

  const fetchSaleOrderData = async () => {
    const res = await getAllSalesOrder({ search, pageSize, pageNo });
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
    const res = await deleteSalesOrderById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowDelete(false);
  };

  const handleClick = (e, tab) => {
    setActiveTab(tab);

    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  const handleChangeSoStatus = async (e, event) => {
    const sData = {
      po_id: e.id,
      status: event.target.checked === true ? "2" : "1",
    };
    const res = await postChangeSoStatus(sData);
    if (res.status) {
      toast.success(res.message);
      fetchSaleOrderData();
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchSaleOrderData();
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
      columnHelper.accessor("so_number", {
        header: "so number",
      }),
      columnHelper.accessor("so_date", {
        header: "so date",
      }),
      columnHelper.accessor("regional_office_name", {
        header: "regional office name",
      }),
      columnHelper.accessor("limit", {
        header: "so limit",
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("used_so_amount", {
        header: "used limit",
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("remaining_so_amount", {
        header: "remaining limit",
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("cr_number", {
        header: "cr number",
      }),
      columnHelper.accessor("cr_date", {
        header: "cr date",
      }),
      columnHelper.accessor("so_status", {
        header: "so status",
        cell: (info) => (
          <div>
            <Switch
              checked={info.row.original.so_status === "2"}
              onChange={(event) =>
                handleChangeSoStatus(info.row.original, event)
              }
            />
            <span
              className={`text-${
                info.row.original.so_status === "2" ? "green" : "orange"
              }`}
            >
              {info.row.original.so_status === "2" ? "Done" : "Working"}
            </span>
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
                    `/sale-order/view-details/${info.row.original.id}?type=sales-order`
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/createSalesOrder/${info.row.original.id}`),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(info.row.original.id);
                  setShowDelete(true);
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
        <title>Sales Order · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Tabs
          onClick={(e, tab) => handleClick(e, tab)}
          activeTab={activeTab}
          ulClassName="border-primary p-2 border-bottom"
          activityClassName="bg-secondary"
        >
          <Tab className="ms-auto" title={t("Sales Order")}>
            {activeTab == 1 && (
              <>
                <CustomTable
                  maxHeight="44vh"
                  id={"sales_order"}
                  userPermission={checkPermission}
                  isLoading={isLoading}
                  rows={rows || []}
                  columns={columns}
                  pagination={{
                    pageNo,
                    pageSize,
                    totalData,
                  }}
                  excelAction={() => ""}
                  pdfAction={() => ""}
                  apiForExcelPdf={getAllSalesOrder}
                  customHeaderComponent={() => (
                    <TableHeader
                      userPermission={checkPermission}
                      setSearchText={setSearch}
                      button={{
                        noDrop: true,
                        to: `/createSalesOrder/new`,
                        title: "Create",
                      }}
                    />
                  )}
                  tableTitleComponent={
                    <div>
                      <BadgeIndianRupee /> <strong>sales order</strong>
                    </div>
                  }
                />

                <ConfirmAlert
                  size={"sm"}
                  deleteFunction={handleDelete}
                  hide={setShowDelete}
                  show={showDelete}
                  title={"Confirm Delete"}
                  description={"Are you sure you want to delete this!!"}
                />
              </>
            )}
          </Tab>
          <Tab title={t("Security Deposit")}>
            {activeTab == 2 && (
              <SecurityDeposit checkPermission={checkPermission} />
            )}
          </Tab>
          <Tab title={t("Security Eligible")}>
            {activeTab == 3 && (
              <SecurityEligible checkPermission={checkPermission} />
            )}
          </Tab>
          <Tab title={t("Security Process")}>
            {activeTab == 4 && (
              <SecurityProcess checkPermission={checkPermission} />
            )}
          </Tab>
          <Tab title={t("Security Paid")}>
            {activeTab == 5 && (
              <SecurityPaid checkPermission={checkPermission} />
            )}
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default SalesOrder;
