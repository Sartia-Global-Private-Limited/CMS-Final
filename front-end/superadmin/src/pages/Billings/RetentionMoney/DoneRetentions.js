import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllBillingFromListing,
  getAllBillingToListingforFilter,
  getAllComplaintTypeListing,
  getAllEligibleAndDoneRetentions,
  getAllOutletListing,
  getAllPONumber,
  getAllRetentionIdListing,
  getAllRoListing,
  getAllSalesAreaListing,
  getInvoiceDetailForRetention,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import { Button, Col, Row } from "react-bootstrap";
import Select from "react-select";
import TooltipComponent from "../../../components/TooltipComponent";
import { FaRegFilePdf } from "react-icons/fa";
import FormLabelText from "../../../components/FormLabelText";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { serialNumber } from "../../../utils/helper";

export default function DoneRetentions() {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();
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
  const [retention_id, setRetention_id] = useState("");
  const [allRetention, setAllRetention] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchAllInvoices = async () => {
    const status = "3";
    const res = await getAllEligibleAndDoneRetentions({
      retention_status: status,
      pageSize,
      pageNo,
      search,
      po_number,
      billing_ro: ro_number,
      sale_area_id: salesAreaId.value,
      billing_to: billingToId.value,
      billing_from: billingFromId.value,
      complaint_type: complaintTypeId.id,
      outlet_id: outletId.id,
      retention_id,
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
    const status = "3";
    const res = await getAllRoListing({ status });
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
    }
  };

  const fetchAllSalesArea = async () => {
    const status = "3";
    const res = await getAllSalesAreaListing({ status });
    if (res.status) {
      setAllSalesArea(res.data);
    } else {
      setAllSalesArea([]);
    }
  };
  const fetchAllOutlet = async () => {
    const status = "3";
    const res = await getAllOutletListing({ status });
    if (res.status) {
      setAllOutlet(res.data);
    } else {
      setAllOutlet([]);
    }
  };
  const fetchAllComplaintType = async () => {
    const status = "3";
    const res = await getAllComplaintTypeListing({ status });
    if (res.status) {
      setAllComplaintType(res.data);
    } else {
      setAllComplaintType([]);
    }
  };
  const fetchAllBillingFrom = async () => {
    const status = "3";
    const res = await getAllBillingFromListing({ status });
    if (res.status) {
      setAllBillingFrom(res.data);
    } else {
      setAllBillingFrom([]);
    }
  };

  const fetchAllBillingTo = async () => {
    const status = "3";
    const res = await getAllBillingToListingforFilter({ status });
    if (res.status) {
      setAllBillingTo(res.data);
    } else {
      setAllBillingTo([]);
    }
  };
  const fetchAllRetention = async () => {
    const status = "3";
    const res = await getAllRetentionIdListing({ status });
    if (res.status) {
      setAllRetention(res.data);
    } else {
      setAllRetention([]);
    }
  };

  const fetchAllPoNumber = async () => {
    const status = "3";
    const res = await getAllPONumber({ status });
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, [
    ro_number,
    po_number,
    salesAreaId,
    outletId?.id,
    complaintTypeId?.id,
    billingToId?.value,
    billingFromId?.value,
    retention_id,
  ]);

  useEffect(() => {
    fetchAllRo();
    fetchAllPoNumber();
    fetchAllSalesArea();
    fetchAllOutlet();
    fetchAllComplaintType();
    fetchAllBillingFrom();
    fetchAllBillingTo();
    fetchAllRetention();
  }, []);

  const HandleDownloadPdf = async (id) => {
    setLoading(id);
    const pdf = 1;
    const response = await getInvoiceDetailForRetention(id, pdf);
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
  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("retention_unique_id", {
        header: "retention unique id",
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
            }}
            custom={
              <>
                <div className="vr hr-shadow"></div>
                <TooltipComponent align="left" title={"PDF"}>
                  <Button
                    className={`view-btn`}
                    variant="light"
                    disabled={loading == info.row.original.id}
                    onClick={() => {
                      HandleDownloadPdf(info.row.original.id);
                    }}
                  >
                    <FaRegFilePdf
                      className={`social-btn  ${
                        loading == info.row.original.id ? "" : "red-combo"
                      }`}
                    />
                  </Button>
                </TooltipComponent>
              </>
            }
          />
        ),
      }),
    ],
    [rows.length, pageNo, pageSize]
  );

  return (
    <>
      <div className="m-2">
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
                  label: data?.regional_office_name,
                  value: data?.id,
                }))}
                onChange={(e) => {
                  setRo_number(e ? e.value : "");
                  fetchAllSalesArea(e?.value);
                }}
                isClearable
              />
            </Col>
            <Col md={3}>
              <FormLabelText children={t("sales area")} />
              <Select
                menuPortalTarget={document.body}
                options={allSalesArea.map((data) => ({
                  label: data.sales_area_name,
                  value: data.id,
                }))}
                onChange={(e) => {
                  setSalesAreaId(e ? e.value : "");
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
            <Col md={3} className="mt-2">
              <FormLabelText children={t("retention id")} />
              <Select
                menuPortalTarget={document.body}
                options={allRetention.map((data) => ({
                  label: data.retention_unique_id,
                  value: data.retention_unique_id,
                }))}
                onChange={(e) => {
                  setRetention_id(e ? e.value : "");
                }}
                isClearable
              />
            </Col>
          </Row>
        </div>
        <CustomTable
          id={"done_retention"}
          isLoading={isLoading}
          rows={rows || []}
          columns={columns}
          pagination={{
            pageNo,
            pageSize,
            totalData,
          }}
          pdfAction={() => ""}
          excelAction={() => ""}
          retention_status={3}
          apiForExcelPdf={getAllEligibleAndDoneRetentions}
          customHeaderComponent={() => (
            <TableHeader
              userPermission={userPermission}
              setSearchText={setSearch}
              button={{ show: false }}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>done retention</strong>
            </div>
          }
        />
      </div>
    </>
  );
}
