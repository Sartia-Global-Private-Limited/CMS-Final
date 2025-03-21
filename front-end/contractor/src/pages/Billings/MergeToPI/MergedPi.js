import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";

import {
  getAllBillingFrom,
  getAllBillingTo,
  getAllComplaintTypeListInvoice,
  getAllOutletForPerforma,
  getAllPoListInvoice,
  getAllRoListInvoice,
  getAllSaListInvoice,
  getComplaintsListingToMerge,
  postMergePi,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import FinalMergeToPI from "./FinalMergeToPI";
import DiscardMergeToPI from "./DiscardMergeToPI";
import FormLabelText from "../../../components/FormLabelText";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import CustomTable, {
  selectable,
} from "../../../components/DataTable/CustomTable";
import TooltipComponent from "../../../components/TooltipComponent";
import TableHeader from "../../../components/DataTable/TableHeader";
import { BsPlus } from "react-icons/bs";
import { serialNumber } from "../../../utils/helper";

const MergedPi = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const [allComplaints, setAllComplaints] = useState([]);

  const [poId, setPoId] = useState({});
  const [allBillingFrom, setAllBillingFrom] = useState([]);
  const [allBillingTo, setAllBillingTo] = useState([]);
  const [regionalOfficceId, setRegionalOfficeId] = useState({});

  const [refresh, setRefresh] = useState(false);
  const [allPo, setAllPo] = useState([]);
  const [allRegionalOffice, setAllRegionalOffice] = useState([]);
  const [salesAreaId, setSalesAreaId] = useState({});
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [complaintTypeId, setComplaintTypeId] = useState({});
  const [allComplaintType, setComplaintType] = useState([]);
  const [billingFromId, setBillingFromId] = useState("");
  const [billingToId, setBillingToId] = useState("");
  const [outletId, setOutletId] = useState({});
  const [allOutlet, setAllOutlet] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [selectedMeasurements, setSelectedMeasurements] = useState([]);
  const { t } = useTranslation();

  const fetchExpenseRequestData = async () => {
    let status = 2;
    const res = await getComplaintsListingToMerge({
      po_id: poId?.id,
      regional_office_id: regionalOfficceId.id,
      sale_area_id: salesAreaId.id,
      outlet_id: outletId.id,
      complaint_type: complaintTypeId?.id,
      billing_from: billingFromId,
      billing_to: billingToId,
      pageSize,
      pageNo,
      search,
      status,
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

  const fetchAllPo = async () => {
    const status = 2;
    const res = await getAllPoListInvoice({ status });
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  const fetchAllRegionalOffice = async () => {
    const status = 2;
    const res = await getAllRoListInvoice({ status });
    if (res.status) {
      setAllRegionalOffice(res.data);
    } else {
      setAllRegionalOffice([]);
    }
  };

  const fetchAllSalesArea = async () => {
    const status = 2;
    const res = await getAllSaListInvoice({ status });
    if (res.status) {
      setAllSalesArea(res.data);
    } else {
      setAllSalesArea([]);
    }
  };

  const fetchAllOutlet = async () => {
    const status = 2;
    const res = await getAllOutletForPerforma({ status });
    if (res.status) {
      setAllOutlet(res.data);
    } else {
      setAllOutlet([]);
    }
  };

  const fetchAllComplaintType = async () => {
    const status = 2;
    const res = await getAllComplaintTypeListInvoice({ status });
    if (res.status) {
      setComplaintType(res.data);
    } else {
      setComplaintType([]);
    }
  };

  const fetchAllBillingFrom = async () => {
    const status = 2;
    const res = await getAllBillingFrom({ status });
    if (res.status) {
      setAllBillingFrom(res.data);
    } else {
      setAllBillingFrom([]);
    }
  };

  const fetchAllBillingTo = async () => {
    const status = 2;
    const res = await getAllBillingTo({ status });
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
    fetchAllOutlet();
    fetchAllBillingFrom();
    fetchAllBillingTo();
    fetchAllComplaintType();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenseRequestData();
  }, [
    pageNo,
    pageSize,
    poId?.id,
    salesAreaId?.id,
    outletId?.id,
    complaintTypeId?.id,
    regionalOfficceId?.id,
    billingFromId,
    billingToId,
    refresh,
  ]);

  const handleClick = (e, tab) => {
    localStorage.setItem("last_tab", tab);
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

  const handleMergePi = async () => {
    const sData = {
      id: selectedMeasurements,
      billing_from: billingFromId,
      billing_to: billingToId,
      billing_to_ro_office: regionalOfficceId?.id,
      po_number: poId.id,
      complaint_for: allComplaints[0]?.complaint_for,
      billing_from_state: allComplaints[0]?.billing_from_state_id,
      financial_year: allComplaints[0]?.financial_year,
    };

    // return console.log(sData, "sdata");
    const res = await postMergePi(sData);
    if (res.status) {
      toast.success(res.message);
      setSelectedMeasurements([]);
      setShowConfirm(false);
      setRefresh(true);
    } else toast.error(res.message);
    setShowConfirm(false);
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
        header: "pi number",
      }),
      columnHelper.accessor("created_at", {
        header: "pi date",
      }),

      columnHelper.accessor("financial_year", {
        header: "financial year",
      }),
      columnHelper.accessor("ro_name", {
        header: "billing rregional office",
        cell: (info) => info.row.original.billing_to_ro_office?.ro_name,
      }),
      columnHelper.accessor("sales_area_name", {
        header: "sales area",
        cell: (info) =>
          info.row.original.salesAreaDetails?.map((item, idx) => (
            <li> {item?.sales_area_name ?? "--"}</li>
          )),
      }),
      columnHelper.accessor("complaint_type_name", {
        header: " complaint type",
        cell: (info) =>
          info.row.original.complaintDetails?.map(
            (item, idx) => item?.complaint_type_name ?? "--"
          ),
      }),
      columnHelper.accessor("billing_from", {
        header: "billing from ",
        cell: (info) => info.row.original.billing_from.company_name,
      }),
      columnHelper.accessor("billing_to", {
        header: "  billing to ",
        cell: (info) => info.row.original.billing_to?.company_name,
      }),
      columnHelper.accessor("outlet_name", {
        header: "  outlet name  ",
        cell: (info) =>
          info.row.original.outletDetails?.map((item, idx) => (
            <li> {item?.outlet_name ?? "--"}</li>
          )),
      }),
      columnHelper.accessor("complaint_unique_id", {
        header: "  complaint id   ",
        cell: (info) =>
          info.row.original.complaintDetails?.map(
            (item, idx) => item?.complaint_unique_id ?? "--"
          ),
      }),
      columnHelper.accessor("po_number", {
        header: "  po  ",
      }),

      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/view-performa-invoice`, {
                    state: {
                      complaint_id: info.row.original?.id,
                    },
                  }),
              },
            }}
          />
        ),
      }),
    ];

    if (poId?.id && regionalOfficceId?.id && salesAreaId.id) {
      baseColumns.unshift(selectable);
    }

    return baseColumns;
  }, [
    checkPermission,
    poId?.id && regionalOfficceId?.id && salesAreaId.id,
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
          <Tab className="pe-none fs-15 fw-bold " />
          <Tab className="ms-auto" title={t("ready to Merge Pi")}>
            <div className="m-2">
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
                          setBillingFromId(null);
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
                          setSalesAreaId({ id: e?.value, name: e?.label });
                        } else {
                          setSalesAreaId({});
                        }
                      }}
                      isClearable
                    />
                  </Col>

                  <Col md={3}>
                    <FormLabelText children={t("Outlet Area")} />
                    <Select
                      menuPortalTarget={document.body}
                      options={allOutlet?.map((user) => ({
                        label: user.outlet_name,
                        value: user.id,
                      }))}
                      onChange={(e) => {
                        if (e) {
                          setOutletId({
                            id: e?.value,
                            name: e?.label,
                          });
                        } else setOutletId({});
                      }}
                      isClearable
                    />
                  </Col>

                  <Col md={3} className="mt-2">
                    <FormLabelText children={t("complaint type")} />
                    <Select
                      menuPortalTarget={document.body}
                      options={allComplaintType?.map((user) => ({
                        label: user.complaint_type_name,
                        value: user.id,
                      }))}
                      onChange={(e) => {
                        setComplaintTypeId({ id: e?.value, name: e?.label });
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
                    <FormLabelText children={t("billing to")} />

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
                id={"ready_to_merge_pi"}
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
                status={2}
                apiForExcelPdf={getComplaintsListingToMerge}
                customHeaderComponent={(selectedRows) => (
                  <TableHeader
                    userPermission={checkPermission}
                    setSearchText={setSearch}
                    button={{ show: false }}
                    extraComponent={
                      selectedRows?.info?.length > 1 && (
                        <TooltipComponent title={"create"} align="top">
                          <Button
                            variant="success"
                            onClick={() => {
                              setSelectedMeasurements(
                                selectedRows.info.map((itm) => itm.original.id)
                              );
                              setShowConfirm(true);
                            }}
                          >
                            <BsPlus />
                            {t("merge")}
                          </Button>
                        </TooltipComponent>
                      )
                    }
                  />
                )}
                tableTitleComponent={
                  <div>
                    <strong>ready to merge pi</strong>
                  </div>
                }
              />

              <ConfirmAlert
                size={"sm"}
                deleteFunction={handleMergePi}
                hide={setShowConfirm}
                show={showConfirm}
                title={"Confirm Merge"}
                description={"Are you sure you want to merge this Pi!!"}
              />
            </div>
          </Tab>

          <Tab title={t("final")}>
            {activeTab == "3" && (
              <FinalMergeToPI checkPermission={checkPermission} />
            )}
          </Tab>
          <Tab title={t("discard")}>
            {activeTab == "4" && (
              <DiscardMergeToPI checkPermission={checkPermission} />
            )}
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default MergedPi;
