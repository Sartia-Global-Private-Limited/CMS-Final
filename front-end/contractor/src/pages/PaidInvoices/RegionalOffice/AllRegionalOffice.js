import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col } from "react-bootstrap";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import {
  getAllPoInPaymentPaid,
  getAllRegionalOfficeListing,
  getAllRoInPaymentPaid,
  postPaymentPaidInRo,
} from "../../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { BsPlus } from "react-icons/bs";
import PaymentProcessInRO from "./PaymentProcessInRO";
import DonePaymentsInRO from "./DonePaymentsInRO";
import PoDetailsInRO from "./PoDetailsInRO";
import FormLabelText from "../../../components/FormLabelText";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable, {
  selectable,
} from "../../../components/DataTable/CustomTable";
import { formatNumberToINR, serialNumber } from "../../../utils/helper";
import TooltipComponent from "../../../components/TooltipComponent";

const AllRegionalOffice = ({ checkPermission }) => {
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allPo, setAllPo] = useState([]);
  const [roId, setRoId] = useState({ label: "", value: "" });
  const [poId, setPoId] = useState({ label: "", value: "" });
  const [totalMeasurement, setTotalMeasurement] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

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

  const fetchAllInvoices = async () => {
    const res = await getAllRegionalOfficeListing(
      pageSize,
      pageNo,
      search,
      roId?.value,
      poId?.label
    );
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

  const fetchAllRo = async () => {
    const res = await getAllRoInPaymentPaid();
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
    }
  };

  const fetchPo = async () => {
    const res = await getAllPoInPaymentPaid();
    if (res.data) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, [pageSize, pageNo, roId?.value, poId?.value, refresh]);

  useEffect(() => {
    fetchAllRo();
    fetchPo();
  }, []);

  const handleClick = async (e, tab) => {
    localStorage.setItem("last_tab", tab);
    setActiveTab(tab);

    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  const handleSubmit = async () => {
    const filteredData = rows.filter((item) =>
      selectedInvoices.includes(item.complaint_id)
    );

    const payment_data = filteredData.map((data) => {
      return {
        billNumber: data.invoice_no,
        bill_date: data.invoice_date,
        complaint_id: data.complaint_id,
        measurement_id: data.measurement_id,
        pv_number: data.pv_number,
        pv_date: data.payment_voucher_date,
        deduction: parseFloat(data.deduction.deduction).toFixed(2),
      };
    });

    const sData = {
      // po_id: filteredData[0]?.po_id,
      // ro_id: filteredData[0]?.ro_id,
      po_id: poId?.value,
      ro_id: roId?.value,
      paid_payment: totalAmount.toFixed(2),
      payment_data,
    };

    const res = await postPaymentPaidInRo(sData);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("invoice_no", {
        header: t("Bill number"),
        cell: (info) =>
          info.row.original.invoice_no ? info.row.original.invoice_no : "-",
      }),
      columnHelper.accessor("invoice_date", {
        header: t("Bill Date"),
        cell: (info) =>
          info.row.original.invoice_date ? info.row.original.invoice_date : "-",
      }),
      columnHelper.accessor("measurement_amount", {
        header: t("Measurement Amount"),
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("complaint_unique_id", {
        header: t("Complaint Number"),
        cell: (info) =>
          info.row.original.complaint_unique_id
            ? info.row.original.complaint_unique_id
            : "-",
      }),
      columnHelper.accessor("po_number", {
        header: t("Po Number"),
        cell: (info) =>
          info.row.original.po_number ? info.row.original.po_number : "-",
      }),
      columnHelper.accessor("po_date", {
        header: t("Po Date"),
        cell: (info) =>
          info.row.original.po_date ? info.row.original.po_date : "-",
      }),
      columnHelper.accessor("area_manager_detail", {
        header: t("Area Manager"),
        cell: (info) =>
          info.row.original.area_manager_detail?.user_name
            ? info.row.original.area_manager_detail?.user_name
            : "-",
      }),
      columnHelper.accessor("ro_name", {
        header: t("Regional Office"),
        cell: (info) =>
          info.row.original.ro_name ? info.row.original.ro_name : "-",
      }),
      columnHelper.accessor("sales_area_name", {
        header: t("Sales Area"),
        cell: (info) =>
          info.row.original.sales_area_name
            ? info.row.original.sales_area_name
            : "-",
      }),
      columnHelper.accessor("payment_voucher_number", {
        header: t("Pv Number"),
        cell: (info) =>
          info.row.original.payment_voucher_number
            ? info.row.original.payment_voucher_number
            : "-",
      }),
      columnHelper.accessor("payment_voucher_date", {
        header: t("Pv Date"),
        cell: (info) =>
          info.row.original.payment_voucher_date
            ? info.row.original.payment_voucher_date
            : "-",
      }),
    ];

    if (roId?.value && poId?.value) {
      baseColumns.unshift(selectable);
    }
    return baseColumns;
  }, [checkPermission, roId?.value && poId?.value, pageNo, pageSize]);

  return (
    <>
      <Helmet>
        <title>Payment Paid Management · CMS Electricals</title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <Card className="card-bg">
          <Tabs
            onClick={(e, tab) => handleClick(e, tab)}
            activeTab={activeTab}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab
              className="pe-none fs-15 fw-bold "
              title={t("Regional office")}
            />

            <Tab className="ms-auto" title={t("All paid bills")}>
              <CustomTable
                id={"all_regional"}
                isLoading={isLoading}
                rows={rows || []}
                columns={columns}
                pagination={{
                  pageNo,
                  pageSize,
                  totalData,
                }}
                customHeaderComponent={(selectedRows) => (
                  <TableHeader
                    userPermission={checkPermission}
                    button={{ show: false }}
                    extraComponent={
                      <div className="d-flex">
                        <div>
                          <FormLabelText children={t("Regional office")} />
                          <Select
                            isClearable
                            isDisabled={poId.value}
                            className="text-primary"
                            placeholder={t("Select Regional..")}
                            value={roId.value && roId}
                            name={t("regional office")}
                            menuPortalTarget={document.body}
                            options={allRo?.map((data) => ({
                              label: data.ro_name,
                              value: data.ro_id,
                            }))}
                            onChange={(e) => {
                              if (e) {
                                setRoId({
                                  value: e?.value,
                                  label: e?.label,
                                });
                              } else {
                                setRoId({});
                              }
                              setTotalAmount(0);
                              setTotalMeasurement(0);
                              setSelectedInvoices([]);
                            }}
                          />
                        </div>

                        <div className="ms-4">
                          <FormLabelText children={t("Po Number")} />
                          <Select
                            className="text-primary"
                            placeholder={t("Select Po..")}
                            menuPortalTarget={document.body}
                            options={allPo?.map((data) => ({
                              label: data.ro_name,
                              value: data.ro_id,
                            }))}
                            value={poId.value && poId}
                            name={"po _number"}
                            onChange={(e) => {
                              if (e) {
                                setPoId({
                                  value: e?.value,
                                  label: e?.label,
                                });
                              } else {
                                setPoId({});
                              }
                              setTotalAmount(0);
                              setTotalMeasurement(0);
                              setSelectedInvoices([]);
                            }}
                            isClearable
                          />
                        </div>

                        {selectedRows?.info?.length > 0 && (
                          <TooltipComponent
                            title={"Create Payment"}
                            align="top"
                          >
                            <Button
                              variant="success"
                              onClick={(e) => handleSubmit()}
                            >
                              <BsPlus />
                              {t("create payment")}
                            </Button>
                          </TooltipComponent>
                        )}
                      </div>
                    }
                  />
                )}
                tableTitleComponent={
                  <div className="fw-bold mx-2">
                    {t("measurement Amount")}{" "}
                    {parseFloat(totalMeasurement)?.toFixed(2)}
                    <br></br>
                    {t("Pay Amount")} {totalAmount?.toFixed(2)}
                  </div>
                }
              />
            </Tab>

            <Tab title={t("payment process")}>
              {activeTab == "3" && (
                <PaymentProcessInRO checkPermission={checkPermission} />
              )}
            </Tab>

            <Tab title={t("done payments")}>
              {activeTab == "4" && (
                <DonePaymentsInRO checkPermission={checkPermission} />
              )}
            </Tab>
            <Tab title={t("Po Details")}>
              {activeTab == "5" && (
                <PoDetailsInRO checkPermission={checkPermission} />
              )}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default AllRegionalOffice;
