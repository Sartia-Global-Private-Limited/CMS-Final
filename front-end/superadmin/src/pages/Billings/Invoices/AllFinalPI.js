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
  getAllBillingFrom,
  getAllBillingTo,
  getAllComplaintTypeListInvoice,
  getAllFinancialYearListInvoice,
  getAllInvoiceListing,
  getAllPoListInvoice,
  getAllRoListInvoice,
  getAllSaListInvoice,
  getDetailsOfFinalMergeToPI,
} from "../../../services/contractorApi";
import AllFinalInvoices from "./AllFinalInvoices";
import DiscardInvoices from "./DiscardInvoices";
import TooltipComponent from "../../../components/TooltipComponent";
import { BsPlus } from "react-icons/bs";
import { FaRegFilePdf } from "react-icons/fa";
import FormLabelText from "../../../components/FormLabelText";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable, {
  selectable,
} from "../../../components/DataTable/CustomTable";
import { serialNumber } from "../../../utils/helper";

const AllFinalPI = () => {
  const [poId, setPoId] = useState({});
  const [allBillingFrom, setAllBillingFrom] = useState([]);
  const [allBillingTo, setAllBillingTo] = useState([]);
  const [regionalOfficceId, setRegionalOfficeId] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [allPo, setAllPo] = useState([]);
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [salesAreaId, setSalesAreaId] = useState({});
  const [complaintTypeId, setComplaintTypeId] = useState({});
  const [allComplaintType, setComplaintType] = useState([]);
  const [allFinancialYears, setAllFinancialYears] = useState([]);
  const [financialYearId, setFinancialYearId] = useState({});
  const [allRegionalOffice, setAllRegionalOffice] = useState([]);
  const [billingFromId, setBillingFromId] = useState("");
  const [billingToId, setBillingToId] = useState("");
  const [showDiscard, setShowDiscard] = useState(false);
  const [idToDiscard, setIdToDiscard] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
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
    const res = await getAllInvoiceListing({
      po_id: poId?.id,
      regional_office_id: regionalOfficceId?.id,
      sale_area_id: salesAreaId?.id,
      complaint_type: complaintTypeId?.id,
      financial_year: financialYearId?.id,
      billing_from: billingFromId,
      billing_to: billingToId,
      pageSize,
      pageNo,
      search,
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
    const invoice = "1";
    const res = await getAllPoListInvoice({ invoice });
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  const fetchAllRegionalOffice = async () => {
    const invoice = "1";
    const res = await getAllRoListInvoice({ invoice });
    if (res.status) {
      setAllRegionalOffice(res.data);
    } else {
      setAllRegionalOffice([]);
    }
  };

  const fetchAllSalesArea = async () => {
    const invoice = "1";
    const res = await getAllSaListInvoice({ invoice });
    if (res.status) {
      setAllSalesArea(res.data);
    } else {
      setAllSalesArea([]);
    }
  };

  const fetchAllComplaintType = async () => {
    const invoice = "1";
    const res = await getAllComplaintTypeListInvoice({ invoice });
    if (res.status) {
      setComplaintType(res.data);
    } else {
      setComplaintType([]);
    }
  };

  const fetchAllFinancialYear = async () => {
    const invoice = "1";
    const res = await getAllFinancialYearListInvoice({ invoice });
    if (res.status) {
      setAllFinancialYears(res.data);
    } else {
      setAllFinancialYears([]);
    }
  };

  const fetchAllBillingFrom = async () => {
    const invoice = "1";
    const res = await getAllBillingFrom({ invoice });
    if (res.status) {
      setAllBillingFrom(res.data);
    } else {
      setAllBillingFrom([]);
    }
  };

  const fetchAllBillingTo = async () => {
    const invoice = "1";
    const res = await getAllBillingTo({ invoice });
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
    fetchAllFinancialYear();
    fetchAllBillingFrom();
    fetchAllBillingTo();
    fetchAllComplaintType();
  }, []);

  useEffect(() => {
    fetchExpenseRequestData();
  }, [
    pageNo,
    pageSize,
    poId?.id,
    complaintTypeId?.id,
    regionalOfficceId?.id,
    billingFromId,
    billingToId,
    salesAreaId?.id,
    financialYearId?.id,
    refresh,
  ]);

  const handleClick = (e, tab) => {
    setActiveTab(tab);
    setBillingFromId("");
    setBillingToId("");
    setPoId("");
    setRegionalOfficeId("");
    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  const HandleDownloadPdf = async (id) => {
    setLoading(id);
    const pdf = 1;
    const response = await getDetailsOfFinalMergeToPI(id, pdf);
    if (response.status) {
      toast.success(response.message);

      const filePath = response.path;
      const fileUrl = `${process.env.REACT_APP_API_URL}${filePath}`;
      window.open(fileUrl, "_blank");
    } else {
      toast.error(response.message);
    }
    setLoading("");
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
        header: t("PI NUMBER"),
        cell: (info) =>
          info.row.original.bill_no ? info.row.original.bill_no : "-",
      }),
      columnHelper.accessor("created_at", {
        header: t("PI Date"),
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
      columnHelper.accessor("sales_area_name", {
        header: "Sales area",
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
      columnHelper.accessor("billing_to_ro_office", {
        header: t("BILLING REGIONAL OFFICE"),
        cell: (info) => info.row.original?.billing_to_ro_office?.ro_name ?? "-",
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
                  navigate(`/view-performa-invoice`, {
                    state: {
                      id: info.row.original?.id,
                      show: "finalPI",
                    },
                  }),
              },
              edit: {
                show: true,
                tooltipTitle: "PDF",
                disabled: false,
                action: () => HandleDownloadPdf(info.row.original?.id),
                icon: FaRegFilePdf,
                align: "top",
                className: `social-btn  ${
                  loading == info.row.original?.id ? "" : "red-combo"
                }`,
              },
              action: {
                show: true,
                tooltipTitle: "PDF",
                disabled: false,
                action: () =>
                  navigate(`/Invoice/CreateInvoice/${"new"}`, {
                    state: {
                      billing_to: info.row.original?.billing_to?.company_id,
                      selectedPI: [info.row.original?.id],
                      po_number: info.row.original?.po_id,
                      regional_office:
                        info.row.original?.billing_to_ro_office.ro_id,
                      billing_from: info.row.original?.billing_from.company_id,
                    },
                  }),
                icon: BsPlus,
                align: "top",
                className: "social-btn red-combo",
              },
            }}
          />
        ),
      }),
    ];

    if (regionalOfficceId.id && billingFromId && billingToId) {
      baseColumns.unshift(selectable);
    }

    return baseColumns;
  }, [regionalOfficceId.id && billingFromId && billingToId, pageNo, pageSize]);

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
          <Tab className="ms-auto" title={t("ready to invoice")}>
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
                        onChange={(e) => {
                          if (e) {
                            setPoId({ id: e?.value, name: e?.label });
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
                        onChange={(e) => {
                          if (e) {
                            setRegionalOfficeId({
                              id: e?.value,
                              name: e?.label,
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
                        onChange={(e) => {
                          if (e) {
                            setSalesAreaId({
                              id: e?.value,
                              name: e?.label,
                            });
                          } else setSalesAreaId({});
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
                          value: user.id,
                        }))}
                        onChange={(e) => {
                          setComplaintTypeId({
                            id: e?.value,
                            name: e?.label,
                          });
                        }}
                        isClearable
                      />
                    </Col>
                    <Col md={3} className="mt-2">
                      <FormLabelText children={t("financial area")} />

                      <Select
                        menuPortalTarget={document.body}
                        options={allFinancialYears?.map((user) => ({
                          label: user.financial_year,
                          value: user.financial_year,
                        }))}
                        onChange={(e) => {
                          if (e) {
                            setFinancialYearId({
                              id: e?.value,
                              name: e?.label,
                            });
                          } else setFinancialYearId();
                        }}
                        isClearable
                      />
                    </Col>
                    <Col md={3} className="mt-2">
                      <FormLabelText children={t("billing from")} />

                      <Select
                        menuPortalTarget={document.body}
                        options={allBillingFrom?.map((user) => ({
                          label: user.company_name,
                          value: user.id,
                        }))}
                        onChange={(e) => {
                          if (e) {
                            setBillingFromId(e ? e?.value : null);
                          } else setBillingFromId(null);
                        }}
                        isClearable
                      />
                    </Col>

                    <Col md={3} className="mt-2">
                      <FormLabelText children={t("billing to ")} />

                      <Select
                        menuPortalTarget={document.body}
                        options={allBillingTo?.map((user) => ({
                          label: user.name,
                          value: user.id,
                        }))}
                        onChange={(e) => {
                          setBillingToId(e ? e?.value : null);
                        }}
                        isClearable
                      />
                    </Col>
                  </Row>
                </div>

                <CustomTable
                  id={"invoice"}
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
                  apiForExcelPdf={getAllInvoiceListing}
                  customHeaderComponent={(selectedRows) => (
                    <TableHeader
                      userPermission={userPermission}
                      setSearchText={setSearch}
                      button={{ show: false }}
                      extraComponent={
                        selectedRows?.info?.length > 0 && (
                          <TooltipComponent
                            title={"create Invoice"}
                            align="top"
                          >
                            <Button
                              variant="success"
                              onClick={() => {
                                navigate(`/Invoice/CreateInvoice/${"new"}`, {
                                  state: {
                                    selectedPI: selectedRows.info.map(
                                      (itm) => itm.original.id
                                    ),
                                    billing_to: billingToId,
                                    po_number: poId?.id,
                                    regional_office: regionalOfficceId?.id,
                                    billing_from: billingFromId,
                                  },
                                });
                              }}
                            >
                              <BsPlus />
                              {t("Create Invoice")}
                            </Button>
                          </TooltipComponent>
                        )
                      }
                    />
                  )}
                  tableTitleComponent={
                    <div>
                      <strong>Ready to invoice</strong>
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

          <Tab title={t("final invoice")}>
            <AllFinalInvoices />
          </Tab>
          <Tab title={t("discard")}>
            <DiscardInvoices />
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default AllFinalPI;
