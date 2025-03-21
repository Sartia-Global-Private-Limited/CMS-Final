import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllEligibleAndDoneRetentions,
  approveEligibleRetention,
  getAllRoListing,
  getAllPONumber,
  getAllSalesAreaListing,
  getAllOutletListing,
  getAllComplaintTypeListing,
  getAllBillingToListingforFilter,
  getAllBillingFromListing,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import { Col, Row, Button } from "react-bootstrap";
import Select from "react-select";
import { BsPlus } from "react-icons/bs";
import FormLabelText from "../../../components/FormLabelText";
import CustomTable, {
  selectable,
} from "../../../components/DataTable/CustomTable";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TooltipComponent from "../../../components/TooltipComponent";
import TableHeader from "../../../components/DataTable/TableHeader";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { FaClipboardCheck } from "react-icons/fa";
import { serialNumber } from "../../../utils/helper";

export default function AllEligibleRetentions() {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);

  const { t } = useTranslation();
  const [allComplaints, setAllComplaints] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [ro_number, setRo_number] = useState("");
  const [po_number, setPo_number] = useState("");
  const [allRo, setAllRo] = useState([]);
  const [allPo, setAllPo] = useState([]);
  const [salesAreaId, setSalesAreaId] = useState({});
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [outletId, setOutletId] = useState({});
  const [allOutlet, setAllOutlet] = useState([]);
  const [complaintTypeId, setComplaintTypeId] = useState({});
  const [allComplaintType, setAllComplaintType] = useState([]);
  const [allBillingTo, setAllBillingTo] = useState([]);
  const [billingToId, setBillingToId] = useState({ label: "", value: "" });
  const [allBillingFrom, setAllBillingFrom] = useState([]);
  const [billingFromId, setBillingFromId] = useState({ label: "", value: "" });
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const navigate = useNavigate();

  const fetchAllInvoices = async () => {
    const status = "1";
    const res = await getAllEligibleAndDoneRetentions({
      retention_status: status,
      pageSize,
      pageNo,
      search,
      po_number,
      billing_ro: ro_number,
      billing_to: billingToId.value,
      billing_from: billingFromId.value,
      sale_area_id: salesAreaId.id,
      outlet_id: outletId.id,
      complaint_type: complaintTypeId.id,
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

  const fetchAllRo = async () => {
    const status = "1";
    const res = await getAllRoListing({ status });
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
    }
  };

  const fetchAllPoNumber = async () => {
    const status = "1";
    const res = await getAllPONumber({ status });
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };
  const fetchAllSalesArea = async () => {
    const status = "1";
    const res = await getAllSalesAreaListing({ status });
    if (res.status) {
      setAllSalesArea(res.data);
    } else {
      setAllSalesArea([]);
    }
  };
  const fetchAllOutlet = async () => {
    const status = "1";
    const res = await getAllOutletListing({ status });
    if (res.status) {
      setAllOutlet(res.data);
    } else {
      setAllOutlet([]);
    }
  };
  const fetchAllComplaintType = async () => {
    const status = "1";
    const res = await getAllComplaintTypeListing({ status });
    if (res.status) {
      setAllComplaintType(res.data);
    } else {
      setAllComplaintType([]);
    }
  };

  const fetchAllBillingFrom = async () => {
    const status = 1;
    const res = await getAllBillingFromListing({ status });
    if (res.status) {
      setAllBillingFrom(res.data);
    } else {
      setAllBillingFrom([]);
    }
  };

  const fetchAllBillingTo = async () => {
    const status = 1;
    const res = await getAllBillingToListingforFilter({ status });
    if (res.status) {
      setAllBillingTo(res.data);
    } else {
      setAllBillingTo([]);
    }
  };

  const handleApproveRetention = async (selectedInvoices) => {
    const sData = { ids: selectedInvoices };
    const res = await approveEligibleRetention(sData);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
    } else {
      toast.error(res.message);
    }
  };
  useEffect(() => {
    fetchAllInvoices();
  }, [
    ro_number,
    po_number,
    salesAreaId?.id,
    outletId?.id,
    complaintTypeId?.id,
    billingToId?.value,
    billingFromId?.value,
    refresh,
  ]);

  useEffect(() => {
    fetchAllRo();
    fetchAllPoNumber();
    fetchAllSalesArea();
    fetchAllOutlet();
    fetchAllComplaintType();
    fetchAllBillingFrom();
    fetchAllBillingTo();
  }, []);

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
        header: "bill Number",
      }),
      columnHelper.accessor("invoice_date", {
        header: "bill date",
      }),
      columnHelper.accessor("outlet_name", {
        header: "outlet name",
        cell: (info) => (
          <div>
            {info.row.original?.outletDetails.map((data) => (
              <li>{data.outlet_name}</li>
            ))}
          </div>
        ),
      }),
      columnHelper.accessor("outlet_unique_id", {
        header: "outlet code",
        cell: (info) => (
          <div>
            {info.row.original?.outletDetails.map((data) => (
              <li>{data.outlet_unique_id}</li>
            ))}
          </div>
        ),
      }),
      columnHelper.accessor("salesAreaDetails", {
        header: "sales area",
        cell: (info) => (
          <div>
            {info.row.original?.salesAreaDetails.map((data) => (
              <li>{data.sales_area_name}</li>
            ))}
          </div>
        ),
      }),
      columnHelper.accessor("ro_name", {
        header: "regioanl office",
      }),
      columnHelper.accessor("complaint_type_name", {
        header: "complaint type",
        cell: (info) => (
          <div>
            {info.row.original?.complaintDetails.map((data) => (
              <li>{data.complaint_type_name}</li>
            ))}
          </div>
        ),
      }),
      columnHelper.accessor("complaint_type_name", {
        header: "complaint type",
        cell: (info) => (
          <div>
            {info.row.original?.complaintDetails.map((data) => (
              <li>{data.complaint_type_name}</li>
            ))}
          </div>
        ),
      }),
      columnHelper.accessor("billingFromData", {
        header: "billing from",
        cell: (info) => info.row.original?.billingFromData.company_name,
      }),
      columnHelper.accessor("billingToData", {
        header: "billing to",
        cell: (info) => info.row.original?.billingToData?.company_name,
      }),
      columnHelper.accessor("complaint_id", {
        header: "complaint code",
        cell: (info) => (
          <div>
            {info.row.original?.complaintDetails.map((data) => (
              <li>{data.complaint_id}</li>
            ))}
          </div>
        ),
      }),
      columnHelper.accessor("po_number", {
        header: "po number",
      }),
      columnHelper.accessor("callup_number", {
        header: "callup number",
      }),
      columnHelper.accessor("pv_number", {
        header: "voucher number",
      }),
      columnHelper.accessor("pv_date", {
        header: "voucher date",
      }),
      columnHelper.accessor("pv_amount", {
        header: "voucher amount",
      }),

      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: true,
                action: () =>
                  navigate(`/view-retention-money`, {
                    state: {
                      id: info.row.original?.id,
                    },
                  }),
              },
              edit: {
                show: true,
                action: () => {
                  navigate(`/create-retention`, {
                    state: {
                      selectedInvoices: [info.row.original.id],
                    },
                  });
                },
              },
            }}
          />
        ),
      }),
    ];

    if (rows.length > 0 && po_number) {
      baseColumns.unshift(selectable);
    }

    return baseColumns;
  }, [rows.length > 0 && po_number, pageNo, pageSize]);

  return (
    <>
      <div className="p-3">
        <div className="shadow p-2 rounded">
          <Row>
            <Col md={3}>
              <FormLabelText children={t("po number")} />

              <Select
                menuPortalTarget={document.body}
                options={allPo.map((data) => ({
                  label: data.po_number,
                  value: data.id,
                }))}
                onChange={(e) => {
                  setPo_number(e ? e.value : "");
                }}
                isClearable
              />
            </Col>
            <Col md={3}>
              <FormLabelText children={t("regional office")} />
              <Select
                menuPortalTarget={document.body}
                options={allRo.map((data) => ({
                  label: data.regional_office_name,
                  value: data.id,
                }))}
                onChange={(e) => {
                  setRo_number(e ? e.value : "");
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
              <FormLabelText children={t("Complaint Type")} />

              <Select
                menuPortalTarget={document.body}
                options={allComplaintType?.map((user) => ({
                  label: user.complaint_type_name,
                  value: user.complaint_type_id,
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
              <FormLabelText children={t("billing from")} />

              <Select
                menuPortalTarget={document.body}
                options={allBillingFrom?.map((user) => ({
                  label: user.company_name,
                  value: user.company_id,
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
                  label: user.company_name,
                  value: user.company_id,
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
          {/* <div className="d-flex justify-content-end ">
            {selectedInvoices.length > 0 && (
              <button
                className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                onClick={() =>
                  handleApproveRetention(
                    selectedRows.info.map((itm) => itm.original.id)
                  )
                }
              >
                <BsPlus />
                approve Retention
              </button>
            )}
          </div> */}
        </div>
        <CustomTable
          id={"eligible_retention"}
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
              userPermission={userPermission}
              setSearchText={setSearch}
              button={{ show: false }}
              extraComponent={
                selectedRows?.info?.length > 0 && (
                  <TooltipComponent title={"approve Retention"} align="top">
                    <Button
                      variant="success"
                      onClick={() =>
                        handleApproveRetention(
                          selectedRows.info.map((itm) => itm.original.id)
                        )
                      }
                      // setTableIds(
                      //   selectedRows.info.map((itm) => itm.original.id)
                      // );
                    >
                      <FaClipboardCheck />
                      {t("eligible Retention")}
                    </Button>
                  </TooltipComponent>
                )
              }
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>Final</strong>
            </div>
          }
        />
      </div>
    </>
  );
}
