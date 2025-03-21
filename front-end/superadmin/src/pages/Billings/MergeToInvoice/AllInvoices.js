import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";

import {
  discardPerformaById,
  getAllBillingFromList,
  getAllBillingToListing,
  getAllComplaintTypeListInInvoice,
  getAllFinalInvoicesListing,
  getAllPoListInMergeInvoice,
  getAllRoListInMergeInvoice,
  getAllSalesAreaInInvoice,
  postMergeInvoice,
} from "../../../services/contractorApi";

import AllMegeInvoices from "./AllMegeInvoices";
import DiscardMergeInvoices from "./DiscardMergeInvoices";
import FormLabelText from "../../../components/FormLabelText";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable, {
  selectable,
} from "../../../components/DataTable/CustomTable";
import TooltipComponent from "../../../components/TooltipComponent";
import { BsPlus } from "react-icons/bs";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { serialNumber } from "../../../utils/helper";

const AllInvoices = () => {
  const [poId, setPoId] = useState({ label: "", value: "" });
  const [salesAreaId, setSalesAreaId] = useState({ label: "", value: "" });
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [complaintTypeId, setComplaintTypeId] = useState({
    label: "",
    value: "",
  });
  const [allComplaintType, setAllComplaintType] = useState([]);
  const [allBillingFrom, setAllBillingFrom] = useState([]);
  const [allBillingTo, setAllBillingTo] = useState([]);
  const [regionalOfficceId, setRegionalOfficeId] = useState({
    label: "",
    value: "",
  });
  const [refresh, setRefresh] = useState(false);
  const [allPo, setAllPo] = useState([]);
  const [allRegionalOffice, setAllRegionalOffice] = useState([]);
  const [billingFromId, setBillingFromId] = useState({ label: "", value: "" });
  const [billingToId, setBillingToId] = useState({ label: "", value: "" });
  const [showDiscard, setShowDiscard] = useState(false);
  const [idToDiscard, setIdToDiscard] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPerformaInvoice, setSelectedPerfomaInvoice] = useState([]);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);

  const fetchExpenseRequestData = async () => {
    const status = 1;
    const res = await getAllFinalInvoicesListing({
      status,
      pageSize,
      pageNo,
      search,
      po_id: poId?.value,
      ro_id: regionalOfficceId?.value,
      sale_area_id: salesAreaId?.value,
      complaint_type: complaintTypeId?.value,
      billing_from: billingFromId?.value,
      billing_to: billingToId?.value,
    });
    if (res.status) {
      setRows(res?.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleDiscard = async () => {
    const res = await discardPerformaById(idToDiscard);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
    } else {
      toast.error(res.message);
    }
    setShowDiscard(false);
    setIdToDiscard("");
  };

  const fetchAllPo = async () => {
    const status = 1;
    const res = await getAllPoListInMergeInvoice(status);
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  const fetchAllRegionalOffice = async () => {
    const status = 1;
    const res = await getAllRoListInMergeInvoice({ status });
    if (res.status) {
      setAllRegionalOffice(res.data);
    } else {
      setAllRegionalOffice([]);
    }
  };

  const fetchAllSalesArea = async () => {
    const status = 1;
    const res = await getAllSalesAreaInInvoice({ status });
    if (res.status) {
      setAllSalesArea(res.data);
    } else {
      setAllSalesArea([]);
    }
  };

  const fetchAllComplaintType = async () => {
    const status = 1;
    const res = await getAllComplaintTypeListInInvoice({ status });
    if (res.status) {
      setAllComplaintType(res.data);
    } else {
      setAllComplaintType([]);
    }
  };

  const fetchAllBillingFrom = async () => {
    const status = 1;
    const res = await getAllBillingFromList({ status });
    if (res.status) {
      setAllBillingFrom(res.data);
    } else {
      setAllBillingFrom([]);
    }
  };

  const fetchAllBillingTo = async () => {
    const status = 1;
    const res = await getAllBillingToListing({ status });
    if (res.status) {
      setAllBillingTo(res.data);
    } else {
      setAllBillingTo([]);
    }
  };

  useEffect(() => {
    fetchAllPo();
    fetchAllRegionalOffice();
    fetchAllSalesArea();
    fetchAllComplaintType();
    fetchAllBillingFrom();
    fetchAllBillingTo();
  }, []);

  useEffect(() => {
    fetchExpenseRequestData();
  }, [
    pageNo,
    pageSize,
    poId.value,
    regionalOfficceId.value,
    salesAreaId.value,
    complaintTypeId.value,
    billingFromId.value,
    billingToId.value,
    refresh,
  ]);

  const handleClick = (e, tab) => {
    setActiveTab(tab);
    setBillingFromId({ label: "", value: "" });
    setBillingToId({ label: "", value: "" });
    setPoId({ label: "", value: "" });
    setRegionalOfficeId({ label: "", value: "" });

    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  const handleMergeInvoice = async ({ id }) => {
    const sData = {
      id: id,
      po_number: poId.value,
      regional_office: regionalOfficceId.value,
      billing_from: billingFromId.value,
      billing_to: billingToId.value,
      companies_for: billingToId.companies_for,
    };

    const res = await postMergeInvoice(sData);
    if (res.status) {
      toast.success(res.message);
      setSelectedPerfomaInvoice([]);
      setRefresh(true);
      setBillingFromId({ label: "", value: "" });
      setBillingToId({ label: "", value: "" });
      setPoId({ label: "", value: "" });
      setRegionalOfficeId({ label: "", value: "" });
    } else toast.error(res.message);
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
      columnHelper.accessor("bill_no", {
        header: t("Invoice NUMBER"),
        cell: (info) =>
          info.row.original.bill_no ? info.row.original.bill_no : "-",
      }),
      columnHelper.accessor("created_at", {
        header: t("Invoice Date"),
        cell: (info) =>
          info.row.original?.created_at ? info.row.original?.created_at : "-",
      }),
      columnHelper.accessor("financial_year", {
        header: t("FINANCIAL year"),
        cell: (info) =>
          info.row.original?.financial_year
            ? info.row.original?.financial_year
            : "-",
      }),
      columnHelper.accessor("billing_to_ro_office", {
        header: t("BILLING REGIONAL OFFICE"),
        cell: (info) => info.row.original?.billing_to_ro_office?.ro_name ?? "-",
      }),
      columnHelper.accessor("sales_area_name", {
        header: "Sales Area Name",
        cell: (info) =>
          info.row.original?.salesAreaDetails
            ? info.row.original?.salesAreaDetails?.map((item, index) => (
                <span key={index}>
                  {" "}
                  {item?.sales_area_name ? item?.sales_area_name : "-"}
                </span>
              ))
            : "-",
      }),
      columnHelper.accessor("complaint_type_name", {
        header: t("Complaint type"),
        cell: (info) =>
          info.row.original?.complaintDetails?.map((item, index) => (
            <span key={index}> {item?.complaint_type_name ?? "-"}</span>
          )),
      }),
      columnHelper.accessor("billing_from", {
        header: t("Billing from"),
        cell: (info) => info.row.original.billing_from?.company_name,
      }),
      columnHelper.accessor("billing_to", {
        header: t("billing to"),
        cell: (info) => info.row.original.billing_to?.company_name,
      }),
      columnHelper.accessor("complaint_unique_id", {
        header: t("Complaint Id"),
        cell: (info) =>
          info.row.original?.complaintDetails?.map((item, index) => (
            <span key={index}> {item?.complaint_unique_id ?? "-"}</span>
          )),
      }),
      columnHelper.accessor("po_number", {
        header: t("Po"),
        cell: (info) =>
          info.row.original?.po_number ? info.row.original?.po_number : "-",
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: true,
                action: () =>
                  navigate(`/view-invoice`, {
                    state: {
                      id: info.row.original?.id,
                    },
                  }),
              },
            }}
          />
        ),
      }),
    ];

    if (
      poId?.value &&
      regionalOfficceId.value &&
      billingFromId?.value &&
      billingToId?.value
    ) {
      baseColumns.unshift(selectable);
    }

    return baseColumns;
  }, [
    poId?.value &&
      regionalOfficceId.value &&
      billingFromId?.value &&
      billingToId?.value,
    pageNo,
    pageSize,
  ]);

  return (
    <>
      <Helmet>
        <title>Billing Management CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Tabs
          onClick={(e, tab) => handleClick(e, tab)}
          activeTab={activeTab}
          ulClassName="border-primary p-2 border-bottom"
          activityClassName="bg-secondary"
        >
          <Tab className="ms-auto" title={t("ready to merge invoice")}>
            <>
              <div className="p-3">
                <div className="shadow p-2 rounded">
                  <Row>
                    <Col md={3}>
                      <FormLabelText children={t("po number")} />

                      <Select
                        menuPortalTarget={document.body}
                        options={allPo?.map((user) => ({
                          label: user.po_number,
                          value: user.id,
                        }))}
                        value={poId.value && poId}
                        onChange={(e) => {
                          if (e) {
                            setPoId({ value: e?.value, label: e?.label });
                          } else {
                            setPoId({});
                          }
                        }}
                        isClearable
                      />
                    </Col>
                    <Col md={3}>
                      <FormLabelText children={t("regional office")} />

                      <Select
                        menuPortalTarget={document.body}
                        options={allRegionalOffice?.map((user) => ({
                          label: user.regional_office_name,
                          value: user.ro_id,
                        }))}
                        value={regionalOfficceId.value && regionalOfficceId}
                        onChange={(e) => {
                          if (e) {
                            setRegionalOfficeId({
                              value: e?.value,
                              label: e?.label,
                            });
                          } else {
                            setRegionalOfficeId({});
                          }
                        }}
                        isClearable
                      />
                    </Col>
                    <Col md={3}>
                      <FormLabelText children={t("sales area")} />

                      <Select
                        menuPortalTarget={document.body}
                        options={allSalesArea?.map((user) => ({
                          label: user.sales_area_name,
                          value: user.id,
                        }))}
                        value={salesAreaId.value && salesAreaId}
                        onChange={(e) => {
                          if (e) {
                            setSalesAreaId({
                              value: e?.value,
                              label: e?.label,
                            });
                          } else {
                            setSalesAreaId({});
                          }
                        }}
                        isClearable
                      />
                    </Col>
                    <Col md={3}>
                      <FormLabelText children={t("complaint type")} />
                      <Select
                        menuPortalTarget={document.body}
                        options={allComplaintType?.map((user) => ({
                          label: user.complaint_type_name,
                          value: user.complaint_type,
                        }))}
                        onChange={(e) => {
                          if (e) {
                            setComplaintTypeId({
                              label: e.label,
                              value: e.value,
                            });
                          } else setComplaintTypeId({ label: "", value: "" });
                        }}
                        isClearable
                      />
                    </Col>
                    <Col md={3} className="mt-2">
                      <FormLabelText children={t("billing from")} />

                      <Select
                        menuPortalTarget={document.body}
                        options={allBillingFrom?.map((user) => ({
                          label: user.name,
                          value: user.id,
                        }))}
                        value={billingFromId?.value && billingFromId}
                        onChange={(e) => {
                          if (e) {
                            setBillingFromId({
                              label: e.label,
                              value: e.value,
                            });
                          } else setBillingFromId({ label: "", value: "" });
                        }}
                        isClearable
                      />
                    </Col>

                    <Col md={3} className="mt-2">
                      <FormLabelText children={t("billing to")} />

                      <Select
                        menuPortalTarget={document.body}
                        options={allBillingTo?.map((user) => ({
                          label: user.name,
                          value: user.id,
                          companies_for: user.companies_for,
                        }))}
                        value={billingToId.value && billingToId}
                        onChange={(e) => {
                          if (e) {
                            setBillingToId({
                              label: e.label,
                              value: e.value,
                              companies_for: e.companies_for,
                            });
                          } else {
                            setBillingToId({});
                          }
                        }}
                        isClearable
                      />
                    </Col>
                  </Row>

                  {poId?.value &&
                    regionalOfficceId?.value &&
                    billingFromId?.value &&
                    billingToId?.value &&
                    selectedPerformaInvoice.length > 1 && (
                      <div className="d-flex justify-content-end">
                        <button
                          className="m-2 shadow border-0 purple-combo cursor-pointer px-4 py-1"
                          onClick={() => handleMergeInvoice()}
                        >
                          {t("Merge Invoice")}
                        </button>
                      </div>
                    )}
                </div>

                <CustomTable
                  id={"merge_invoice"}
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
                  status={1}
                  apiForExcelPdf={getAllFinalInvoicesListing}
                  customHeaderComponent={(selectedRows) => (
                    <TableHeader
                      userPermission={userPermission}
                      setSearchText={setSearch}
                      button={{ show: false }}
                      extraComponent={
                        selectedRows?.info?.length > 1 && (
                          <TooltipComponent title={"Merge Invoice"} align="top">
                            <Button
                              variant="success"
                              onClick={() =>
                                handleMergeInvoice({
                                  id: selectedRows.info.map(
                                    (itm) => itm?.original?.id
                                  ),
                                })
                              }
                            >
                              <BsPlus />
                              {t("Merge Invoice")}
                            </Button>
                          </TooltipComponent>
                        )
                      }
                    />
                  )}
                  tableTitleComponent={
                    <div>
                      <strong>ready to merge invoice</strong>
                    </div>
                  }
                />

                <ConfirmAlert
                  size={"sm"}
                  deleteFunction={handleDiscard}
                  hide={setShowDiscard}
                  show={showDiscard}
                  title={"Confirm Discard"}
                  description={"Are you sure you want to discard this!!"}
                />
              </div>
            </>
          </Tab>

          <Tab title={t("final")}>
            <AllMegeInvoices />
          </Tab>
          <Tab title={t("discard")}>
            <DiscardMergeInvoices />
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default AllInvoices;
