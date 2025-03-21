import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactPagination from "../../../components/ReactPagination";
import ActionButton from "../../../components/ActionButton";
import Select from "react-select";

import {
  getAllAreaManagerforfilter,
  getAllCompanyNAme,
  getAllComplaintTypeforfilter,
  getAllOrderByForBilling,
  getAllOutletforfilter,
  getAllPoList,
  getAllReadyToPi,
  getAllRoList,
  getAllSalesAreaforfilter,
} from "../../../services/contractorApi";
import { BsPlus } from "react-icons/bs";
import TooltipComponent from "../../../components/TooltipComponent";
import PerformaListing from "./PerformaListing";
import PerformaDiscard from "./PerformaDiscard";
import PerformaFinalListing from "./PerformaFinalListing";
import ExportExcelPdf from "../../../components/ExportExcelPdf";
import FormLabelText from "../../../components/FormLabelText";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import StatusChip from "../../../components/StatusChip";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import CustomTable, {
  selectable,
} from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { serialNumber } from "../../../utils/helper";

const AllReadyToPi = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState(2);
  const [allPo, setAllPo] = useState([]);
  const [poId, setPoId] = useState({});
  const [regionalOfficceId, setRegionalOfficeId] = useState({});
  const [allRegionalOffice, setAllRegionalOffice] = useState([]);
  const [areaManagerId, setAreaManagerId] = useState({});
  const [allAreaManager, setAllAreaManager] = useState([]);
  const [salesAreaId, setSalesAreaId] = useState({});
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [complaintTypeId, setComplaintTypeId] = useState({});
  const [allComplaintType, setAllComplaintType] = useState([]);
  const [outletId, setOutletId] = useState({});
  const [allOutlet, setAllOutlet] = useState([]);
  const [orderById, setOrderById] = useState({});
  const [allOrderBy, setAllOrderBy] = useState([]);
  const [complaint_id, setComplaint_id] = useState("");
  const [companyDetails, setCompanyDetails] = useState({});
  const [companyNameList, setCompanyNameList] = useState([]);
  const { t } = useTranslation();

  const fetchExpenseRequestData = async () => {
    let status = 5;
    const res = await getAllReadyToPi({
      po_id: poId.id,
      regional_office_id: regionalOfficceId.id,
      complaint_id: complaint_id,
      pageSize,
      pageNo,
      search,
      status,
      complaint_for: companyDetails?.complaint_for,
      energy_company_id: companyDetails?.company_id,
      sale_area_id: salesAreaId?.id,
      order_by_id: orderById?.id,
      area_manager_id: areaManagerId?.id,
      outlet_id: outletId?.id,
      complaint_type: complaintTypeId?.id,
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

  const fetchAllSalesManager = async () => {
    const status = 5;
    const res = await getAllSalesAreaforfilter(status);
    if (res.status) {
      setAllSalesArea(res.data);
    } else {
      setAllSalesArea([]);
    }
  };
  const fetchAllOrderBy = async () => {
    const status = 5;
    const pi_status = "0";
    const res = await getAllOrderByForBilling({ status, pi_status });
    if (res.status) {
      setAllOrderBy(res.data);
    } else {
      setAllOrderBy([]);
    }
  };
  const fetchAllOutlet = async () => {
    const status = 5;
    const res = await getAllOutletforfilter(status);
    if (res.status) {
      setAllOutlet(res.data);
    } else {
      setAllOutlet([]);
    }
  };
  const fetchAllComplaintType = async () => {
    const status = 5;
    const res = await getAllComplaintTypeforfilter({ status });
    if (res.status) {
      setAllComplaintType(res.data);
    } else {
      setAllComplaintType([]);
    }
  };
  const fetchAllAreaManager = async () => {
    const status = 5;
    const res = await getAllAreaManagerforfilter(status);
    if (res.status) {
      setAllAreaManager(res.data);
    } else {
      setAllAreaManager([]);
    }
  };
  const fetchAllPo = async () => {
    const status = 5;
    const res = await getAllPoList(status);
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  const fetchAllRegionalOffice = async () => {
    const status = 5;
    const res = await getAllRoList(status);
    if (res.status) {
      setAllRegionalOffice(res.data);
    } else {
      setAllRegionalOffice([]);
    }
  };

  const fetchAllCompanyName = async () => {
    const status = 5;
    const res = await getAllCompanyNAme({ status });
    if (res.status) {
      setCompanyNameList(res.data);
    } else {
      setCompanyNameList([]);
    }
  };

  useEffect(() => {
    fetchAllPo();
    fetchAllRegionalOffice();
    fetchAllSalesManager();
    fetchAllOrderBy();
    fetchAllOutlet();
    fetchAllAreaManager();
    fetchAllCompanyName();
    fetchAllComplaintType();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenseRequestData();
  }, [
    pageNo,
    pageSize,
    poId,
    regionalOfficceId.id,
    complaint_id,
    companyDetails.company_id,
    companyDetails.value,
    areaManagerId.id,
    salesAreaId.id,
    orderById.id,
    outletId?.id,
    complaintTypeId?.id,
  ]);

  const handleClick = (e, tab) => {
    setActiveTab(tab);

    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  // const headerNames = [
  //   { name: "COMPLAINT NO.", value: "complaint_unique_id" },
  //   { name: "COMPLAINT TYPE", value: "complaint_type_name" },
  //   { name: "OUTLET", value: "outlet_name" },
  //   { name: "ro", value: "regional_office_name" },
  //   { name: "sa", value: "sales_area_name" },
  //   { name: "Company name", value: "company_details" },
  //   { name: "area manager", value: "area_manager_name" },
  //   { name: "PO Number", value: "po_number" },
  //   { name: "ORDER BY", value: "order_by_name" },
  //   { name: "status", value: "status" },
  //   {
  //     name: "measurement Amount",
  //     value: "measurement_amount",
  //   },
  //   { name: "measurement date", value: "measurement_date" },
  //   { name: "po Amount", value: "po_limit" },
  // ];

  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("complaint_unique_id", {
        header: "complaint number",
      }),
      columnHelper.accessor("complaint_type_name", {
        header: "complaint type",
      }),

      columnHelper.accessor("outlet_name", {
        header: "outlet",
      }),
      columnHelper.accessor("regional_office_name", {
        header: "ro",
      }),
      columnHelper.accessor("sales_area_name", {
        header: "sa",
      }),
      columnHelper.accessor("name", {
        header: " company name",
        cell: (info) => info.row.original.company_details?.name,
      }),
      columnHelper.accessor("area_manager_name", {
        header: " area manager ",
      }),
      columnHelper.accessor("po_number", {
        header: "  po number ",
      }),
      columnHelper.accessor("order_by_name", {
        header: "  order by  ",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={info.row.original.status} />,
      }),
      columnHelper.accessor("measurement_amount", {
        header: "measurement amount",
      }),
      columnHelper.accessor("measurement_date", {
        header: "measurement date",
      }),
      columnHelper.accessor("po_limit", {
        header: "po amount",
      }),

      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/view-measurement-details`, {
                    state: {
                      complaint_id: info.row.original?.id,
                    },
                  }),
              },
            }}
            custom={
              <TooltipComponent align="left" title={"Create"}>
                <Button
                  className={`view-btn`}
                  variant="light"
                  // disabled={selectedMeasurements.length > 1}
                  onClick={() => {
                    navigate(`/PerformaInvoice/CreatePerformaInvoice/new`, {
                      state: {
                        regionalOfficceId: {
                          name: info.row.original?.po_regional_office_name,
                          id: info.row.original?.po_ro_id,
                        },
                        measurements: [info.row.original.id],
                        allData: info.row.original,
                        poId: {
                          id: info.row.original?.po_id,
                          name: info.row.original?.po_number,
                        },
                        companyDetails: {
                          name: info.row.original?.po_company_name,
                          id: info.row.original?.po_company_id,
                          complaint_for: info.row.original?.complaint_for,
                        },
                      },
                    });
                  }}
                >
                  <BsPlus className={`social-btn red-combo`} />
                </Button>
              </TooltipComponent>
            }
          />
        ),
      }),
    ];

    if (poId?.id && regionalOfficceId?.id) {
      baseColumns.unshift(selectable);
    }

    return baseColumns;
  }, [checkPermission, poId?.id && regionalOfficceId?.id, pageNo, pageSize]);

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
          <Tab className="pe-none fs-15 fw-bold" />
          <Tab className="ms-auto" title={t("ready to pi")}>
            {activeTab == "2" && (
              <>
                <div className="p-3">
                  <div className="shadow p-2 rounded">
                    <Row>
                      <Col md={3}>
                        <FormLabelText children={t("Company Name")} />

                        <Select
                          menuPortalTarget={document.body}
                          options={companyNameList?.map((user) => ({
                            label: `${user?.company_name} (${
                              user?.complaint_for == 1 ? "Ec" : "Oc"
                            })`,
                            value: `${user?.company_id}-${user?.complaint_for}`,
                            complaint_for: user?.complaint_for,
                            company_id: user?.company_id,
                          }))}
                          onChange={(e) => {
                            if (e) {
                              setCompanyDetails(e);
                            } else {
                              setCompanyDetails({});
                            }
                          }}
                          isClearable
                        />
                      </Col>
                      <Col md={3}>
                        <FormLabelText children={t("Po number")} />

                        <Select
                          menuPortalTarget={document.body}
                          options={allPo?.map((user) => ({
                            label: user.po_number,
                            value: user.po_id,
                            company_name: user.company_name,
                            complaint_for: user.complaint_for,
                            energy_company_id: user.energy_company_id,
                            regional_office_name: user.regional_office_name,
                            ro_id: user.ro_id,
                          }))}
                          onChange={(e) => {
                            if (e) {
                              setPoId({
                                id: e?.value,
                                name: e?.label,
                                company_name: e?.company_name,
                                complaint_for: e?.complaint_for,
                                energy_company_id: e?.energy_company_id,
                                regional_office_name: e?.regional_office_name,
                                ro_id: e?.ro_id,
                              });
                            } else {
                              setPoId({});
                            }
                          }}
                          isClearable
                        />
                      </Col>

                      <Col md={3}>
                        <FormLabelText children={t("regional_office")} />
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
                            } else setRegionalOfficeId({});
                          }}
                          isClearable
                        />
                      </Col>
                      <Col md={3}>
                        <FormLabelText children={t("Sales Area")} />

                        <Select
                          menuPortalTarget={document.body}
                          options={allSalesArea?.map((user) => ({
                            label: user.sales_area_name,
                            value: user.sale_area_id,
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
                      <Col md={3} className="mt-2">
                        <FormLabelText children={t("ORDER BY")} />
                        <Select
                          menuPortalTarget={document.body}
                          options={allOrderBy?.map((user) => ({
                            label: user.name,
                            value: user.id ? user.id : user.name,
                          }))}
                          onChange={(e) => {
                            if (e) {
                              setOrderById({
                                id: e?.value,
                                name: e?.label,
                              });
                            } else setOrderById({});
                          }}
                          isClearable
                        />
                      </Col>
                      <Col md={3} className="mt-2">
                        <FormLabelText children={t("Outlet Area")} />
                        <Select
                          menuPortalTarget={document.body}
                          options={allOutlet?.map((user) => ({
                            label: user.outlet_name,
                            value: user.outlet_id,
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
                        <FormLabelText children={t("Complaint Type")} />

                        <Select
                          menuPortalTarget={document.body}
                          options={allComplaintType?.map((user) => ({
                            label: user.complaint_type_name,
                            value: user.id,
                          }))}
                          onChange={(e) => {
                            if (e) {
                              setComplaintTypeId({
                                id: e?.value,
                                name: e?.label,
                              });
                            } else setComplaintTypeId({});
                          }}
                          isClearable
                        />
                      </Col>
                      <Col md={3} className="mt-2">
                        <FormLabelText children={t("Area Manager")} />

                        <Select
                          menuPortalTarget={document.body}
                          options={allAreaManager?.map((user) => ({
                            label: user.name,
                            value: user.id,
                          }))}
                          onChange={(e) => {
                            if (e) {
                              setAreaManagerId({
                                id: e?.value,
                                name: e?.label,
                              });
                            } else setAreaManagerId({});
                          }}
                          isClearable
                        />
                      </Col>
                    </Row>
                  </div>

                  <CustomTable
                    id={"all_ready_to_pi"}
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
                    status={5}
                    apiForExcelPdf={getAllReadyToPi}
                    customHeaderComponent={(selectedRows) => (
                      <TableHeader
                        userPermission={checkPermission}
                        setSearchText={setSearch}
                        button={{ show: false }}
                        extraComponent={
                          selectedRows?.info?.length > 0 && (
                            <TooltipComponent title={"create"} align="top">
                              <Button
                                variant="success"
                                onClick={() => {
                                  // setTableIds(
                                  //   selectedRows.info.map((itm) => itm.original.id)
                                  // );
                                  navigate(
                                    `/PerformaInvoice/CreatePerformaInvoice/new`,
                                    {
                                      state: {
                                        measurements: selectedRows.info.map(
                                          (itm) => itm.original.id
                                        ),
                                        companyDetailFromFilter: companyDetails,
                                        poId,
                                      },
                                    }
                                  );
                                }}
                              >
                                <BsPlus />
                                {t("Approve")}
                              </Button>
                            </TooltipComponent>
                          )
                        }
                      />
                    )}
                    tableTitleComponent={
                      <div>
                        <UserPlus /> <strong>all ready to pi</strong>
                      </div>
                    }
                  />
                </div>
              </>
            )}
          </Tab>
          <Tab title={[t("Performa Invoice")]}>
            {activeTab == "3" && (
              <PerformaListing checkPermission={checkPermission} />
            )}
          </Tab>

          <Tab title={[t("final")]}>
            {activeTab == "4" && (
              <PerformaFinalListing checkPermission={checkPermission} />
            )}
          </Tab>
          <Tab title={[t("discard")]}>
            {activeTab == "5" && (
              <PerformaDiscard checkPermission={checkPermission} />
            )}
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default AllReadyToPi;
